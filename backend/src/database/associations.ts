import User from '../models/User';
import Transaction from '../models/Transaction';

// Relação: Um Usuário (User) pode ter muitas Transações (Transaction)
User.hasMany(Transaction, {
  foreignKey: 'userId',
  as: 'transactions', // Alias para a associação
});

// Relação: Uma Transação (Transaction) pertence a um Usuário (User)
Transaction.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user', // Alias para a associação
});