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
// handle delete requests
exports.handleDeleteRequest = async (req, res) => {
    const { requestID } = req.params;
    const { status } = req.body;
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Access denied. Only admins can handle requests.' });
        }

        const [requestResult] = await db.execute('SELECT providerID, actionType, serviceID FROM Requests WHERE requestID = ?', [requestID]);
        if (requestResult.length === 0) {
            return res.status(404).json({ message: 'Request not found.' });
        }
        const { providerID, serviceID, actionType } = requestResult[0];
                const [serviceResult] = await db.execute('SELECT serviceType FROM Service WHERE serviceID = ?', [serviceID]);
                serviceType = serviceResult[0].serviceType;
                if (serviceType === "hotel") {
                    await db.execute('DELETE FROM Hotels WHERE serviceID = ?', [serviceID]);
                } else if (serviceType === "restaurant") {
                    await db.execute('DELETE FROM Restaurants WHERE serviceID = ?', [serviceID]);
                }
                await db.execute('DELETE FROM Service WHERE serviceID = ?', [serviceID]);
                await db.execute('UPDATE Requests SET status = "approved" WHERE requestID = ?', [requestID]);
                res.status(200).json({ message: 'Request approved successfully.' });
            }
    catch (error) {
        console.error('Error in handleDeleteRequest:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

// handle add requests
exports.handleRequest = async (req, res) => {
    const { requestID } = req.params;
    const { status } = req.body;
    console.log(status);
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Access denied. Only admins can handle requests.' });
        }

        const [requestResult] = await db.execute('SELECT providerID, actionType, requestData FROM Requests WHERE requestID = ?', [requestID]);
        if (requestResult.length === 0) {
            return res.status(404).json({ message: 'Request not found.' });
        }
        const { providerID, serviceID, actionType, requestData } = requestResult[0];
        // console.log(requestData);
        // console.log();

            if (actionType === 'add') {
                // destrusture requestData to get attrs
                const data = JSON.parse(requestData);
                const { name, description, rating, serviceType, locationName } = data;
    
                // Find locationID using locationName
                const [locationResult] = await db.execute('SELECT locationID FROM Location WHERE locationName = ?', [locationName]);
                if (locationResult.length === 0) {
                    return res.status(404).json({ message: 'Location not found.' });
                }
                const locationID = locationResult[0].locationID;
    
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
            } 
        await db.execute('UPDATE Requests SET status = "approved" WHERE requestID = ?', [requestID]);
        res.status(200).json({ message: 'Request approved successfully.' });
    } catch (error) {
            console.error('Error in handleRequest:', error.message);
            res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// reject requests
exports.rejectRequest = async (req, res) => {
        const { requestID } = req.params;
        const { status } = req.body;
    
        try {
            if (req.user.role !== 'Admin') {
                return res.status(403).json({ message: 'Access denied. Only admins can handle requests.' });
            }
    
            if (status === 'rejected') {
                await db.execute('UPDATE Requests SET status = "rejected" WHERE requestID = ?', [requestID]);
                res.status(200).json({ message: 'Request rejected successfully.' });
            } else {
                res.status(400).json({ message: 'Invalid status.' });
            }
        } catch (error) {
            console.error('Error in rejectRequest:', error.message);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    };