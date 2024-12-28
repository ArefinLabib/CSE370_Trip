const db = require('../Database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
    console.log(req.body);
    
    const {userName, password, email, role} = req.body;


    try {
        // Check if email already exists
        const [existingUser] = await db.execute(
            'SELECT * FROM accounts WHERE email = ?', [email]
        );
        if (existingUser.length > 0) {
            console.log('Existing user found:', existingUser);
            return res.status(409).json({
                status: 'error',
                message: 'Email is already registered. Please use a different email.'
            });
        }

        // Hash password. Inserting plain password in database poses security concerns
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into accounts table
        const [result] = await db.execute(
            'INSERT INTO accounts (userName, password, email, role) VALUES (?, ?, ?, ?)',
            [userName, hashedPassword, email, role]
        );
        const userID = result.insertId; // Get the newly created user ID
        
        // Insert into role-specific table. We will take "role type" from an input field in the registration page form.
        switch (role.trim()) {
            case 'Admin':
                await db.execute(
                    'INSERT INTO Admin (userID) VALUES (?)',
                    [userID]
                );
                break;

            case 'Tourist':
                await db.execute(
                    'INSERT INTO touristDetails (userID) VALUES (?)',
                    [userID]
                );
                break;

            case 'Service':
                await db.execute(
                    'INSERT INTO ServiceDetails (userID) VALUES (?)', 
                    [userID]
                );
                break;

            default:
                return res.status(400).json({ message: 'Invalid role' });
            }
        res.status(201).json({ message: 'User registered successfully' , result});
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};



exports.login = async (req, res) => {
    console.log(req.body);
    
    const {email, password } = req.body;

    try {
        // Check if user exists
        const [user] = await db.execute('SELECT * FROM accounts WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords with pass saved in database
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token for later authentications
        const token = jwt.sign(
            { id: user[0].ID, email: user[0].email, role: user[0].role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );


        res.status(200).json({ message: 'Login successful', token, role: user[0].role });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};