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

  const { password, ...userResponse } = user.get({ plain: true });

  res.status(200).json({
    message: 'Você está autenticado!',
    token: token,
    userId: user.id,
    user: userResponse, 
  });
};

export default createUserToken;
