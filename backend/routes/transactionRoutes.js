import express from 'express';
import { addTransaction, getTransactions } from '../controllers/transactionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, admin, addTransaction).get(protect, getTransactions);

export default router;
