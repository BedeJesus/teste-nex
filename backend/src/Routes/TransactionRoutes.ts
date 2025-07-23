import { Router } from 'express';
import TransactionController from '../controllers/TransactionController';
import upload from '../helpers/upload';

// Middlewares de proteção (descomentar quando criados)
// import checkToken from '../helpers/check-token';
// import checkAdmin from '../helpers/check-admin';

const router = Router();

router.post('/upload', upload.single('sheet'), TransactionController.uploadSheet);

export default router;