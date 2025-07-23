import { Router } from 'express';
import UserController from '../Controllers/UserController';

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/checkuser', UserController.checkUser);
router.get('/wallet/:id', UserController.getWalletValue);

export default router;