const mysql = require('mysql2');
require('dotenv').config();

try {

    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectionLimit: 10 
    });
    const promisePool = pool.promise(); // Use promises for async/await
    module.exports = promisePool;
} catch {
    console.error('Error creating the database pool:', error.message);
    process.exit(1);
}

