const db = require('../Database/db');

exports.getHotelDetails = async (req, res) => {
    const serviceID = req.query.serviceId;
    try {
        const [hotelResult] = await db.execute('SELECT * FROM Service WHERE serviceID = ?', [serviceID]);
        if (hotelResult.length === 0) {
            return res.status(404).json({ message: 'Hotel not found.' });
        }
        res.status(200).json(hotelResult[0]);
    } catch (error) {
        console.error('Error fetching hotel details:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.addServiceReview = async (req, res) => {
    const { serviceId, description, rating } = req.body;
    console.log(req.body);
    
    const userId = req.user.ID;

    try {
        const [locationResult] = await db.execute('SELECT locationID FROM Service WHERE serviceID = ?', [serviceId]);
        const locationID = locationResult[0].locationID;

        const [touristResult] = await db.execute('SELECT touristID FROM TouristDetails WHERE userID = ?', [userId]);
        const touristId = touristResult[0].touristID;

        await db.execute('INSERT INTO Reviews (userID, serviceID, locationID, rating, description) VALUES (?, ?, ?, ?, ?)', 
            [touristId, serviceId, locationID, rating, description]);
        await db.execute('UPDATE Service SET rating = (SELECT AVG(rating) FROM Reviews WHERE serviceID = ?) WHERE serviceID = ?', [serviceId, serviceId]);
        res.status(201).json({ message: 'Review added successfully.' });
    } catch (error) {
        console.error('Error adding review:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getServiceReviews = async (req, res) => {
    const serviceId = req.query.serviceId;
    try {
        const [reviews] = await db.execute(`
            SELECT r.rating, r.description, a.userName FROM 
            (Reviews r INNER JOIN TouristDetails t ON r.userID = t.touristID) 
            INNER JOIN accounts a ON t.userID = a.ID WHERE r.serviceID = ?;
        `, [serviceId]);
        res.status(200).json({ reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
