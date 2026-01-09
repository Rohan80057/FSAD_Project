const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/finsight', {
    // useNewUrlParser and useUnifiedTopology are no longer needed in Mongoose 6+ but good for older versions if any
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use(cors());
app.use(express.json());

const authRouter = require('./routes/auth');
const transactionsRouter = require('./routes/transactions');
const dashboardRouter = require('./routes/dashboard');

// Routes
app.get('/', (req, res) => {
    res.send('FinSight API is running');
});

app.use('/api/auth', authRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/dashboard', dashboardRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

