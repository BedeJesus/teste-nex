import { Router } from 'express';
import TransactionController from '../controllers/TransactionController';
import upload from '../helpers/upload';
import checkToken from '../helpers/verify-token';

const router = Router();

router.post('/upload', checkToken, upload.single('sheet'), TransactionController.uploadSheet);
router.get('/', checkToken, TransactionController.getTransactions);

export default router;