import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());

let donations = [
    { id: 1, item: 'Winter Jacket', condition: 'Good', donor: 'Alice', recipient: '' },
    { id: 2, item: 'School Bag', condition: 'Like New', donor: 'Bob', recipient: '' }
];

// API routes
app.get('/api/donations', (req, res) => {
    res.json(donations);
});

app.post('/api/donate', (req, res) => {
    const newItem = { 
        id: donations.length + 1, 
        ...req.body, 
        recipient: '' 
    };
    donations.push(newItem);
    res.json({ message: 'Donation added successfully!', donations });
});

app.post('/api/claim', (req, res) => {
    const { id, recipient } = req.body;
    const donation = donations.find(d => d.id === id);
    if (donation && !donation.recipient) {
        donation.recipient = recipient;
        res.json({ message: 'Item claimed successfully!', donation });
    } else {
        res.status(400).json({ message: 'Item not found or already claimed.' });
    }
});

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
