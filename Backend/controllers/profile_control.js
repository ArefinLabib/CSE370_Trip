const db = require('../Database/db');

exports.getUserProfile = async (req, res) => {
    try {
        const userID = req.user.id;

        const [userResult] = await db.execute('SELECT userName, email, role FROM accounts WHERE ID = ?', [userID]);
        if (userResult.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const user = userResult[0];
        console.log(user);
        
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};