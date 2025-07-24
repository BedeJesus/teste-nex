import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection';

interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  password: string;
  cpf: string;
  isAdmin?: boolean; 
}

class User extends Model<UserAttributes> implements UserAttributes {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare isAdmin: boolean;
  declare cpf: string;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING(11), 
    allowNull: false,
    unique: true,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, 
  },
}, {
  sequelize,
  tableName: 'users', 
  timestamps: true,
});

export default User;