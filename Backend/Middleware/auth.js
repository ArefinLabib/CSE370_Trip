const jwt = require('jsonwebtoken');
const db = require('../Database/db');

exports.authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [userResult] = await db.execute('SELECT * FROM accounts WHERE ID = ?', [decoded.id]);
        if (userResult.length === 0) {
            return res.status(401).json({ message: 'Invalid token.' });
        }
        req.user = userResult[0];
        // console.log('Authenticated user:', req.user); // Add this line for debugging
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
};