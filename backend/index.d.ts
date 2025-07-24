import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    // Realiza a fusão de declarações com a interface Request nativa do Express
    export interface Request {
      // Adiciona a propriedade 'user' para que o TypeScript a reconheça
      user?: string | JwtPayload;
    }
  }
}