import express from 'express'
import cors from 'cors'
import sequelize, { testConnection } from './database/connection';
import './models/User';
import './models/Transaction';
import './database/associations';
import UserRoutes from "./Routes/UserRoutes";
import TransactionRoutes from "./Routes/transactionRoutes";

const app = express()
const port =  4000;

app.use(express.json())
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }))

//Routes
app.use('/users', UserRoutes)
app.use('/transactions', TransactionRoutes);

const startServer = async () => {
  try {
    await testConnection();
    await sequelize.sync(); 

    console.log('✅ Tabelas sincronizadas com o banco de dados.');
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
};

startServer();

