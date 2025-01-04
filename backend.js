const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sample in-memory storage for wishlist items and user emails
let wishlistItems = [];
let userEmails = [];

// Endpoint to get the wishlist
app.get('/wishlist', (req, res) => {
  res.json(wishlistItems);
});

// Endpoint to add an item to the wishlist
app.post('/add-item', (req, res) => {
  const { location, hotel } = req.body;
  if (location && hotel) {
    const newItem = { location, hotel };
    wishlistItems.push(newItem);
    res.status(201).json({ message: 'Item added to wishlist', item: newItem });
  } else {
    res.status(400).json({ message: 'Location and hotel are required' });
  }
});

// Endpoint to delete an item from the wishlist
app.delete('/delete-item', (req, res) => {
  const { location, hotel } = req.body;
  wishlistItems = wishlistItems.filter(item => item.location !== location || item.hotel !== hotel);
  res.status(200).json({ message: 'Item deleted from wishlist' });
});

// Endpoint to add an email for notifications
app.post('/notify', (req, res) => {
  const { email } = req.body;
  if (email) {
    userEmails.push(email);
    res.status(200).json({ message: `You will be notified at ${email} about discounts` });
  } else {
    res.status(400).json({ message: 'Email is required' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
