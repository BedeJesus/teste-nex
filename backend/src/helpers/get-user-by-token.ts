import jwt from 'jsonwebtoken';
import User from '../models/User';

interface DecodedToken {
  id: number;
  name: string;
}

const getUserByToken = async (token: string) => {
  if (!token) {
    return null;
  }
  const decoded = jwt.verify(token, 'secret_key') as DecodedToken;
  const user = await User.findByPk(decoded.id);
  return user;
};

export default getUserByToken;