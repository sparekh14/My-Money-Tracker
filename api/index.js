const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');

const app = express();

app.use(cors());
app.use(express.json());

// Existing Routes
app.get('/api/test', (req, res) => {
    res.json("Hello from the server!");
});

app.post('/api/transaction', async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const { name, description, datetime, price } = req.body;

        // Basic Validation
        if (
            typeof name !== 'string' ||
            typeof description !== 'string' ||
            typeof datetime !== 'string' ||
            typeof price !== 'number'
        ) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        const transaction = await Transaction.create({ name, description, datetime, price });
        res.status(201).json(transaction);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/transactions', async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a Transaction
app.put('/api/transaction/:id', async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const { id } = req.params;
        const { name, description, datetime, price } = req.body;

        // Basic Validation
        if (
            typeof name !== 'string' ||
            typeof description !== 'string' ||
            typeof datetime !== 'string' ||
            typeof price !== 'number'
        ) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        const updatedTransaction = await Transaction.findByIdAndUpdate(
            id,
            { name, description, datetime, price },
            { new: true, runValidators: true }
        );

        if (!updatedTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json(updatedTransaction);
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a Transaction
app.delete('/api/transaction/:id', async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const { id } = req.params;

        const deletedTransaction = await Transaction.findByIdAndDelete(id);

        if (!deletedTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(4040, () => {
    console.log('Server is running on port 4040');
});