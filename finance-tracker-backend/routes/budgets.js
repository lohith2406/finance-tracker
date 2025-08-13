const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Budget = require('../models/Budget');

// Create a new budget
router.post('/', authMiddleware, async (req, res) => {
  const { category, amount, period } = req.body;

  try {
    const existingBudget = await Budget.findOne({ userId: req.user.id, category, period });
    if (existingBudget) return res.status(400).json({ message: 'Budget for this category & period already exists' });

    const budget = new Budget({
      userId: req.user.id,
      category,
      amount,
      period
    });

    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    console.error("Budget creation error:", error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Get all budgets for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a budget by ID
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, userId: req.user.id });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });

    Object.assign(budget, req.body);
    await budget.save();

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a budget by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });

    res.json({ message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
