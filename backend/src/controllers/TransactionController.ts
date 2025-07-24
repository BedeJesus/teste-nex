import { Request, Response } from 'express';
import xlsx from 'xlsx';
import User from '../models/User';
import Transaction from '../models/Transaction';
import sequelize from '../database/connection';
import { Op } from 'sequelize';

interface SheetRow {
  CPF: string;
  'Descrição da transação': string;
  'Data da transação': number | string;
  'Valor em pontos': string;
  Valor: string;
  Status: 'Aprovado' | 'Reprovado' | 'Em avaliação';
}

interface ITransactionFilters {
  search?: string;
  cpf?: string;
  startDate?: string;
  endDate?: string;
  minValue?: string;
  maxValue?: string;
  status?: string;
}

function buildWhereClause(filters: ITransactionFilters) {
  const whereClause: any = {};

  if (filters.search) {
    whereClause.description = {
      [Op.like]: `%${filters.search}%`
    };
  }

  if (filters.cpf) {
    whereClause.cpf = filters.cpf;
  }

  if (filters.startDate && filters.endDate) {
    const endOfDay = new Date(filters.endDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    whereClause.transactionDate = {
      [Op.between]: [new Date(filters.startDate), endOfDay]
    };
  }

  if (filters.minValue || filters.maxValue) {
    whereClause.value = {};
    if (filters.minValue) {
      whereClause.value[Op.gte] = parseFloat(filters.minValue);
    }
    if (filters.maxValue) {
      whereClause.value[Op.lte] = parseFloat(filters.maxValue);
    }
  }

  if (filters.status) {
    whereClause.status = filters.status;
  }

  return whereClause;
}

export default class TransactionController {
  static async uploadSheet(req: Request, res: Response) {

    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }

    const dbTransaction = await sequelize.transaction();

    try {
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer', cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data: SheetRow[] = xlsx.utils.sheet_to_json(worksheet);

      const transactionsToCreate: Array<{
        description: string;
        transactionDate: Date;
        points: number;
        value: number;
        status: 'Aprovado' | 'Reprovado' | 'Em avaliação';
        userId: number;
        cpf: string;
      }> = [];

      let skippedDuplicates = 0;

      for (const row of data) {

        const cpf = String(row.CPF).replace(/[^\d]/g, '');

        if (cpf.length !== 11) {
          console.warn(`CPF inválido ignorado: ${row.CPF}`);

        }

        const points = parseInt(String(row['Valor em pontos']).replace(/[,.]/g, ''), 10);
        const value = parseFloat(String(row.Valor).replace('.', '').replace(',', '.'));
        const transactionDate = new Date(row['Data da transação']);

        if (isNaN(points) || isNaN(value) || isNaN(transactionDate.getTime())) {
          console.warn(`Valores inválidos na linha para o CPF ${row.CPF}. Pontos: ${row['Valor em pontos']}, Valor: ${row.Valor}`);
        }

        const existingTransaction = await Transaction.findOne({
          where: {
            description: row['Descrição da transação'],
            transactionDate,
            points,
            value,
            status: row.Status,
          },
          transaction: dbTransaction,
        });

        if (existingTransaction) {
          skippedDuplicates++;
        }

        transactionsToCreate.push({
          description: row['Descrição da transação'],
          transactionDate,
          cpf,
          points,
          value,
          status: row.Status,
          userId: req.body.userId,
        });
      }

      if (transactionsToCreate.length > 0) {
        await Transaction.bulkCreate(transactionsToCreate, { transaction: dbTransaction });
      }

      await dbTransaction.commit();

      let message = `${transactionsToCreate.length} transações criadas com sucesso.`;
      if (skippedDuplicates > 0) {
        message += ` ${skippedDuplicates} transações duplicadas foram ignoradas.`;
      }


      return res.status(200).json({ message });

    } catch (error) {
      await dbTransaction.rollback();
      return res.status(500).json({ message: 'Erro ao processar a planilha.', error: (error as Error).message });
    }
  }

  static async getTransactions(req: Request, res: Response) {

    const page = parseInt(req.query.page as string, 10) || 1;
    const search = (req.query.search as string) || '';
    const cpf = (req.query.cpfToSend as string) || (req.query.cpf as string);
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const minValue = req.query.minValue as string;
    const maxValue = req.query.maxValue as string;
    const status = req.query.status as string;

    const limit = 15;
    const offset = (page - 1) * limit;

    const whereClause = buildWhereClause({
      search,
      cpf,
      startDate,
      endDate,
      minValue,
      maxValue,
      status
    });

    try {
      const { count, rows } = await Transaction.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['transactionDate', 'ASC']]
      });

      const transactions = rows.map((transactionInstance) => {

        const t = transactionInstance.toJSON();
        const numericValue = Number(t.value);

        return {
          id: t.id,
          description: t.description,
          cpf: t.cpf,
          status: t.status,
          transactionDate: new Date(t.transactionDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
          valueInPoint: t.points,
          value: numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        };
      });

      const totalPages = Math.ceil(count / limit);

      res.status(200).json({
        transactions,
        totalPages,
        currentPage: page
      });
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      res.status(500).json({ message: 'Ocorreu um erro no servidor' });
    }
  }
}