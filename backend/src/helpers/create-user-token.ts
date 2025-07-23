import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../models/User';

const createUserToken = async (user: User, req: Request, res: Response) => {

  const token = jwt.sign(
    {
      name: user.name,
      id: user.id, 
    },
    'secret_key',
  );

  // Remove a senha do objeto de usuário antes de enviar a resposta
  const { password, ...userResponse } = user.get({ plain: true });

  res.status(200).json({
    message: 'Você está autenticado!',
    token: token,
    userId: user.id,
    user: userResponse, // Envia os dados do usuário para o frontend
  });
};

export default createUserToken;
