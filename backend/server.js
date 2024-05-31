
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Define Mongoose Schema and Model
const invoiceSchema = new mongoose.Schema({
  customerName: String,
  tax: Number,
  tip: Number,
  items: [
    {
      itemName: String,
      quantity: Number,
      price: Number,
    },
  ],
  userId: String, // New field to store user ID
  createdAt: { type: Date, default: Date.now },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/invoiceManegmentSystem',
  {
    dbName: 'invoiceManegmentSystem',
    useNewUrlParser: true, useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.post('/api/invoices', async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).send(invoice);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/invoices/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    res.status(200).send(invoice);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Route to get invoices by user ID
app.get('/api/invoices/user/:userId', async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.params.userId });
    res.status(200).send(invoices);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Route to get all invoices
app.get('/api/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).send(invoices);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/api/invoices/:id', async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).send(error);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});















