const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Please add some text']
    },
    amount: {
        type: Number,
        required: [true, 'Please add a positive or negative number']
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    date: {
        type: String,
        // Store as YYYY-MM-DD for simplicity in this demo, or use Date type
        default: () => new Date().toISOString().split('T')[0]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
