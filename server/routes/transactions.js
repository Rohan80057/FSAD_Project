const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Get all transactions
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 });
        // Map _id to id for frontend compatibility if needed, or update frontend
        const formatted = transactions.map(t => ({
            id: t._id,
            text: t.text,
            amount: t.amount,
            type: t.type,
            date: t.date
        }));
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Add transaction
router.post('/', async (req, res) => {
    try {
        const { text, amount, type, date } = req.body;
        const transaction = await Transaction.create({
            text,
            amount,
            type,
            date
        });

        res.status(201).json({
            id: transaction._id,
            text: transaction.text,
            amount: transaction.amount,
            type: transaction.type,
            date: transaction.date
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: 'Validation Error', details: err.message });
        }
        res.status(500).json({ error: 'Server Error' });
    }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: 'Transaction deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
