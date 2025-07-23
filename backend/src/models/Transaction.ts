import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection';

export type TransactionStatus = 'Aprovado' | 'Reprovado' | 'Em avaliação';

interface TransactionAttributes {
  id?: number;
  cpf: string;
  description: string;
  transactionDate: Date;
  points: number;
  value: number;
  status: TransactionStatus;
  userId: number;
}

class Transaction extends Model<TransactionAttributes> implements TransactionAttributes {
  public id!: number;
  public cpf!: string;
  public description!: string;
  public transactionDate!: Date;
  public points!: number;
  public value!: number;
  public status!: TransactionStatus;
  public userId!: number;
}

Transaction.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cpf: {
    type: DataTypes.STRING(11),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transactionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Aprovado', 'Reprovado', 'Em avaliação'),
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
}, {
  sequelize,
  tableName: 'transactions',
  timestamps: true,
});

export default Transaction;