import { Request, Response } from 'express';
import xlsx from 'xlsx';
import User from '../models/User';
import Transaction from '../models/Transaction';
import sequelize from '../database/connection';

interface SheetRow {
  CPF: string;
  'Descrição da transação': string;
  'Data da transação': number | string; 
  'Valor em pontos': string;
  Valor: string;
  Status: 'Aprovado' | 'Reprovado' | 'Em avaliação';
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
          continue;
        }
    
        const points = parseInt(String(row['Valor em pontos']).replace(/[,.]/g, ''), 10);
        const value = parseFloat(String(row.Valor).replace('.', '').replace(',', '.'));
        const transactionDate = new Date(row['Data da transação']);

        if (isNaN(points) || isNaN(value) || isNaN(transactionDate.getTime())) {
          console.warn(`Valores inválidos na linha para o CPF ${row.CPF}. Pontos: ${row['Valor em pontos']}, Valor: ${row.Valor}`);
          continue;
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
      console.error(error);
      return res.status(500).json({ message: 'Erro ao processar a planilha.', error: (error as Error).message });
    }
  }
}