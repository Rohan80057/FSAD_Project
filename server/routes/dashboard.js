const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

router.get('/stats', async (req, res) => {
    try {
        const transactions = await Transaction.find();

        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + t.amount, 0);

        const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + t.amount, 0);

        const balance = totalIncome - totalExpenses;

        res.json({
            totalIncome,
            totalExpenses,
            balance
        });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
