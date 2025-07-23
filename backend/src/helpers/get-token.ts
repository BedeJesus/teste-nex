import { Request } from 'express';

const getToken = (req: Request): string => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return '';
  }
  return authHeader.split(' ')[1];
};

export default getToken;