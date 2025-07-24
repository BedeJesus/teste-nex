import { Router } from 'express';
import UserController from '../controllers/UserController';
import checkToken from '../helpers/verify-token';

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/checkuser', UserController.checkUser);
router.get('/wallet/:id',checkToken, UserController.getWalletValue);

export default router;