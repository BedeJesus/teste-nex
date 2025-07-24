import jwt from 'jsonwebtoken';
import getToken from './get-token';
import { Request, Response, NextFunction } from 'express';

const checkToken = (req:Request, res:Response, next:NextFunction) => {

    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Acesso negado, sem header de autorização' })
    }

    const token = getToken(req)

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado, tente atualizar a página' })
    }

    try{
        const verified = jwt.verify(token,'secret_key')
        req.user = verified
        next()

    }catch(err){
        return res.status(400).json({ message: 'Token inválido' })
    }
}

export default checkToken;
