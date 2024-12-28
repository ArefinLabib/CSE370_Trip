const db = require('../Database/db');

exports.getPendingRequests = async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Access denied. Only admins can view requests.' });
        }

        const [requests] = await db.execute('SELECT * FROM Requests WHERE status = "pending"');
        res.status(200).json({ requests });
    } catch (error) {
        console.error('Error in getPendingRequests:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.handleRequest = async (req, res) => {
    const { requestID } = req.params;
    const { status } = req.body;
    console.log(status);
    

    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Access denied. Only admins can handle requests.' });
        }

        const [requestResult] = await db.execute('SELECT providerID, requestData FROM Requests WHERE requestID = ?', [requestID]);
        if (requestResult.length === 0) {
            return res.status(404).json({ message: 'Request not found.' });
        }
        const { providerID, requestData } = requestResult[0];

        // Parse requestData JSON
        const data = JSON.parse(requestData);
        const { name, description, rating, serviceType, locationName } = data;

        // Find locationID using locationName
        const [locationResult] = await db.execute('SELECT locationID FROM Location WHERE locationName = ?', [locationName]);
        if (locationResult.length === 0) {
            return res.status(404).json({ message: 'Location not found.' });
        }
        const locationID = locationResult[0].locationID;

        if (status === 'approved') {
           const [serviceResult] = await db.execute('INSERT INTO Service (name, description, rating, serviceType, locationID, providerID) VALUES (?, ?, ?, ?, ?, ?)', 
                [name, description, rating, serviceType, locationID, providerID]);
            
                const newServiceID = serviceResult.insertId;

                // Add to service type-specific tables
                if (serviceType === 'hotel') {
                    await db.execute(
                        'INSERT INTO Hotels (serviceID) VALUES (?)',
                        [newServiceID]
                    );
                } else if (serviceType === 'restaurant') {
                    await db.execute(
                        'INSERT INTO Restaurants (serviceID) VALUES (?)',
                        [newServiceID]);
                }

        await db.execute('UPDATE Requests SET status = "approved" WHERE requestID = ?', [requestID]);
        res.status(200).json({ message: 'Request approved successfully.' });
    } else if (status === 'rejected') {
        await db.execute('UPDATE Requests SET status = "rejected" WHERE requestID = ?', [requestID]);
        res.status(200).json({ message: 'Request rejected successfully.' });
    } else {
        res.status(400).json({ message: 'Invalid status.' });
    } 
} catch (error) {
        console.error('Error in handleRequest:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};