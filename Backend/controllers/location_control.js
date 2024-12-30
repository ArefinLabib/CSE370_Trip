const db = require('../Database/db');

exports.getLocations = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    try {
        const [locations] = await db.execute('SELECT * FROM Location LIMIT ? OFFSET ?', [limit, offset]);
        res.status(200).json({ locations });
    } catch (error) {
        console.error('Error fetching locations:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};