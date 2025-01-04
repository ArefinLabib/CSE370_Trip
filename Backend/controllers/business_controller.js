const db = require('../Database/db');

exports.getUserBusinesses = async (req, res) => {
    try {
        // Ensure the user is a provider
        if (req.user.role !== 'Service') {
            return res.status(403).json({ message: 'Access denied. Only business accounts can view their businesses.' });
        }

        // console.log(req.user.ID);
        
        // Fetch providerID
        const [provider] = await db.execute('SELECT providerID FROM ServiceDetails WHERE userID = ?', [req.user.ID]);
        if (!provider.length) {
            return res.status(404).json({ message: 'Provider not found.' });
        }
        const providerID = provider[0].providerID;
        

        // Fetch all services owned by the provider
        const [businesses] = await db.execute(
            `SELECT s.serviceID, s.name, s.description, s.serviceType, s.rating, l.locationName 
                FROM Service s 
                JOIN Location l ON s.locationID = l.locationID 
                WHERE s.providerID = ?;`,
            [providerID]
        );

        res.status(200).json({ message: 'Businesses fetched successfully', businesses });
    } catch (error) {
        console.error('Error in getUserBusinesses:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};  

// request to delete business
exports.deleteRequest = async (req, res) => {
    const { serviceID } = req.params;

    try {
        // Ensure the user is a provider
        if (req.user.role !== 'Service') {
            return res.status(403).json({ message: 'Access denied. Only business accounts can submit requests.' });
        }

        // Fetch providerID
        const [provider] = await db.execute('SELECT providerID FROM ServiceDetails WHERE userID = ?', [req.user.ID]);
        if (!provider.length) {
            return res.status(404).json({ message: 'Provider not found.' });
        }
        const providerID = provider[0].providerID;

        // Insert delete request into the Requests table
        await db.execute(
            'INSERT INTO Requests (providerID, serviceID, actionType, requestData) VALUES (?, ?, ?, ?)',
            [providerID, serviceID, 'delete', JSON.stringify({ serviceID })]
        );

        res.status(201).json({ message: 'Delete request submitted successfully. Awaiting admin approval.' });
    } catch (error) {
        console.error('Error in deleteRequest:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


// request to add a business
exports.addRequest = async (req, res) => {
    // console.log(req.body);
    const { action, serviceID, requestBody } = req.body; // serviceID is null in case of adding new Business
    // console.log(action, serviceID, requestBody);
    

    try {
        // Ensure the user is a provider
        if (req.user.role !== 'Service') {
            return res.status(403).json({ message: 'Access denied. Only business accounts can submit requests.' });
        }

        // Fetch providerID
        const [provider] = await db.execute('SELECT providerID FROM ServiceDetails WHERE userID = ?', [req.user.id]);
        if (!provider.length) {
            return res.status(404).json({ message: 'Provider not found.' });
        }
        const providerID = provider[0].providerID;
        console.log(providerID);
        

        // Insert request into the Requests table
        await db.execute(
            'INSERT INTO Requests (providerID, serviceID, actionType, requestData) VALUES (?, ?, ?, ?)',
            [providerID, serviceID || null, action, JSON.stringify(requestBody)]
        );

        res.status(201).json({ message: 'Request submitted successfully. Awaiting admin approval.' });
    } catch (error) {
        console.error('Error in submitRequest:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.editRequest = async (req, res) => {
    const { serviceID } = req.params;
    const {action, serviceID2, requestBody} = req.body;

    try {
        // Ensure the user is a provider
        if (req.user.role !== 'Service') {
            return res.status(403).json({ message: 'Access denied. Only business accounts can submit requests.' });
        }

        // Fetch providerID
        const [provider] = await db.execute('SELECT providerID FROM ServiceDetails WHERE userID = ?', [req.user.ID]);
        if (!provider.length) {
            return res.status(404).json({ message: 'Provider not found.' });
        }
        const providerID = provider[0].providerID;

        // Insert edit request into the Requests table
        await db.execute(
            'INSERT INTO Requests (providerID, serviceID, actionType, requestData) VALUES (?, ?, ?, ?)',
            [providerID, serviceID, action, JSON.stringify(requestBody)]
        );

        res.status(201).json({ message: 'Edit request submitted successfully. Awaiting admin approval.' });
    } catch (error) {
        console.error('Error in editRequest:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};