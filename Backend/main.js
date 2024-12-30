const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user_auth_route');
const businessRoutes = require('./routes/business_route');
const adminRoutes = require('./routes/admin_route');
const profileRoutes = require('./routes/profile_route');
const locationRoutes = require('./routes/location_route');

const app = express();

app.use(cors());
require('dotenv').config();
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes); 
app.use('/business', businessRoutes);
app.use('/admin', adminRoutes);
app.use('/profile', profileRoutes); 
app.use('/location', locationRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));