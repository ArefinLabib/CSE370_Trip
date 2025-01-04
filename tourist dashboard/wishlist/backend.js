const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../../Backend/Database/db'); // Adjust the path as necessary

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint to add an item to the wishlist
app.post('/add-item', async (req, res) => {
  const { userId, location, hotel } = req.body;

  if (location && hotel) {
    try {
      // Check if location exists
      const [locationResult] = await db.execute('SELECT locationID FROM Location WHERE locationName = ?', [location]);
      if (locationResult.length === 0) {
        return res.status(404).json({ message: 'No such location found' });
      }
      const locationID = locationResult[0].locationID;

      // Check if hotel exists
      const [hotelResult] = await db.execute(
        'SELECT serviceID FROM Service WHERE serviceType = "hotel" AND name = ? AND locationID = ?',
        [hotel, locationID]
      );
      if (hotelResult.length === 0) {
        return res.status(404).json({ message: 'No such hotel exists here' });
      }
      const hotelID = hotelResult[0].serviceID;

      // Insert into wishlist
      await db.execute('INSERT INTO Wishlist (touristID, locationID, serviceID) VALUES (?, ?, ?)', [
        userId,
        locationID,
        hotelID,
      ]);

      res.status(201).json({ message: 'Item added to wishlist' });
    } catch (error) {
      console.error('Error adding item to wishlist:', error.message);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  } else {
    res.status(400).json({ message: 'Location and hotel are required' });
  }
});

// Endpoint to delete an item from the wishlist
app.delete('/delete-item', async (req, res) => {
  const { userId, location, hotel } = req.body;

  try {
    // Find locationID and hotelID
    const [locationResult] = await db.execute('SELECT locationID FROM Location WHERE locationName = ?', [location]);
    if (locationResult.length === 0) {
      return res.status(404).json({ message: 'No such location found' });
    }
    const locationID = locationResult[0].locationID;

    const [hotelResult] = await db.execute(
      'SELECT serviceID FROM Service WHERE serviceType = "hotel" AND name = ? AND locationID = ?',
      [hotel, locationID]
    );
    if (hotelResult.length === 0) {
      return res.status(404).json({ message: 'No such hotel exists here' });
    }
    const hotelID = hotelResult[0].serviceID;

    // Delete from wishlist
    await db.execute('DELETE FROM Wishlist WHERE touristID = ? AND locationID = ? AND serviceID = ?', [
      userId,
      locationID,
      hotelID,
    ]);

    res.status(200).json({ message: 'Item deleted from wishlist' });
  } catch (error) {
    console.error('Error deleting item from wishlist:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Endpoint to get all wishlist items
app.get('/wishlist', async (req, res) => {
  const { userId } = req.query;

  try {
    const [result] = await db.execute(
      `SELECT L.locationName, S.name AS hotel
       FROM Wishlist W
       JOIN Location L ON W.locationID = L.locationID
       JOIN Service S ON W.serviceID = S.serviceID
       WHERE W.touristID = ?`,
      [userId]
    );

    res.json(result);
  } catch (error) {
    console.error('Error fetching wishlist:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Endpoint to add email for notifications
app.post('/notify', (req, res) => {
  const { email } = req.body;

  if (email) {
    // This could be extended to store emails in a database if required
    res.status(200).json({ message: `You will be notified at ${email} about discounts` });
  } else {
    res.status(400).json({ message: 'Email is required' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});