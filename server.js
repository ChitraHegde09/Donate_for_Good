import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/donateforgood';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Donation Schema
const donationSchema = new mongoose.Schema({
  item: String,
  condition: String,
  donor: String,
  recipient: { type: String, default: "" },
  category: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

const Donation = mongoose.model('Donation', donationSchema);

// API Routes
app.get('/api/donations', async (req, res) => {
  const donations = await Donation.find().sort({ createdAt: -1 });
  res.json(donations);
});

app.post('/api/donate', async (req, res) => {
  const newDonation = new Donation(req.body);
  await newDonation.save();
  res.json({ message: 'Donation added successfully!' });
});

app.post('/api/claim', async (req, res) => {
  const { id, recipient } = req.body;
  const donation = await Donation.findById(id);
  if (!donation || donation.recipient) {
    return res.status(400).json({ message: 'Item not found or already claimed.' });
  }
  donation.recipient = recipient;
  await donation.save();
  res.json({ message: 'Item claimed successfully!', donation });
});

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
