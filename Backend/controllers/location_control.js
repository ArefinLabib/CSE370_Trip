const db = require('../Database/db');

exports.getLocations = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    try {
        const [locations] = await db.execute('SELECT * FROM Location LIMIT ? OFFSET ?', [limit, offset]);
        // console.log(locations[0]);
        
        res.status(200).json({ locations });
    } catch (error) {
        console.error('Error fetching locations:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getLocationDetails = async (req, res) => {
    const locationId = req.query.locationId;
    try {
        const [locationResult] = await db.execute('SELECT * FROM Location WHERE locationID = ?', [locationId]);
        if (locationResult.length === 0) {
            return res.status(404).json({ message: 'Location not found.' });
        }
        res.status(200).json(locationResult[0]);
    } catch (error) {
        console.error('Error fetching location details:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getLocationReviews = async (req, res) => {
    const locationId = req.query.locationId;
    try {
        const [reviews] = await db.execute(`
            SELECT r.rating, r.description, a.userName  FROM 
            (Reviews r INNER JOIN TouristDetails t ON r.userID = t.touristID) 
            INNER JOIN accounts a ON t.userID=a.ID WHERE r.locationID = ?;
        `, [locationId]);
        res.status(200).json({ reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getLocationServices = async (req, res) => {
    const locationId = req.query.locationId;
    try {
        const [services] = await db.execute('SELECT * FROM Service WHERE locationID = ?', [locationId]);
        res.status(200).json({ services });
    } catch (error) {
        console.error('Error fetching services:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.addLocationReview = async (req, res) => {
    const { locationId, description, rating } = req.body;
    const userId = req.user.ID;
    // console.log(req.user);
    // console.log(req.body);
    try {
        const [touristResult] = await db.execute('SELECT touristID FROM touristdetails WHERE userID = ?', [userId]);
        if (touristResult.length === 0) {
            return res.status(404).json({ message: 'Tourist not found.' });
        }
        const touristId = touristResult[0].touristID;


        await db.execute('INSERT INTO Reviews (userID, locationID, rating, description) VALUES (?, ?, ?, ?)', 
            [touristId, locationId, rating, description]);
        await db.execute('UPDATE Location SET rating = (SELECT AVG(rating) FROM Reviews WHERE locationID = ?) WHERE locationID = ?', [locationId, locationId]);
        res.status(201).json({ message: 'Review added successfully.' });
    } catch (error) {
        console.error('Error adding review:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};    
