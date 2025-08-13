const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// Get spending analytics per category
router.get('/spending', authMiddleware, async (req, res) => {
  try {
    // Get all budgets and transactions for the user
    const budgets = await Budget.find({ userId: req.user.id });
    const transactions = await Transaction.find({ userId: req.user.id });

    // Calculate total spent per category
    const spendingPerCategory = {};

    transactions.forEach(txn => {
      if (txn.type === 'expense') {
        spendingPerCategory[txn.category] = (spendingPerCategory[txn.category] || 0) + txn.amount;
      }
    });

    // Merge with budgets
    const result = budgets.map(budget => ({
      category: budget.category,
      budget: budget.amount,
      spent: spendingPerCategory[budget.category] || 0,
      remaining: budget.amount - (spendingPerCategory[budget.category] || 0)
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get spending trend
router.get('/trend', authMiddleware, async (req, res) => {
  try {
    const { period = 'monthly', category } = req.query; 
    // period can be 'monthly' or 'weekly'
    // optional category filter

    // Fetch user expenses
    const filter = { userId: req.user.id, type: 'expense' };
    if (category) filter.category = category;

    const transactions = await Transaction.find(filter);

    const trend = {};

    transactions.forEach(txn => {
      const date = new Date(txn.date);
      let key;

      if (period === 'weekly') {
        // ISO week number
        const oneJan = new Date(date.getFullYear(),0,1);
        const week = Math.ceil((((date - oneJan) / 86400000) + oneJan.getDay()+1)/7);
        key = `${date.getFullYear()}-W${week}`;
      } else {
        // monthly by default
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        key = `${date.getFullYear()}-${month}`;
      }

      trend[key] = (trend[key] || 0) + txn.amount;
    });

    res.json(trend);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
