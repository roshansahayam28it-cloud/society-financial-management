import Transaction from '../models/Transaction.js';

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private/Admin
const addTransaction = async (req, res, next) => {
  try {
    const { type, category, amount, description, date } = req.body;

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      category,
      amount,
      description,
      date,
    });

    if (transaction) {
      res.status(201).json(transaction);
    } else {
      res.status(400);
      throw new Error('Invalid transaction data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find().populate('user', 'name email').sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

export { addTransaction, getTransactions };
