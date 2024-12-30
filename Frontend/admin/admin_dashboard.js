document.getElementById('homeButton').addEventListener('click', () => {
    window.location.href = '../Landing Page/landing.html';
});

document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.replace('../Signup/registration.html');
});

const token = localStorage.getItem('token');

async function fetchPendingRequests() {
    try {
        const response = await fetch('http://localhost:8081/admin/getPendingRequests', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            displayRequests(data.requests);
        } else {
            document.getElementById('message').textContent = data.message || 'Failed to fetch requests.';
        }
    } catch (error) {
        document.getElementById('message').textContent = 'Error fetching requests.';
        console.error(error);
    }
}

function displayRequests(requests) {
    const requestList = document.getElementById('requestList');
    requestList.innerHTML = '';

    if (requests.length === 0) {
        document.getElementById('message').textContent = 'No pending requests.';
        return;
    }

    requests.forEach((request) => {
        const listItem = document.createElement('li');
        listItem.className = 'request-item';

        const requestInfo = document.createElement('div');
        requestInfo.className = 'request-info';
        requestInfo.innerHTML = `
            <h2>Request ID: ${request.requestID}</h2>
            <p><strong>Provider ID:</strong> ${request.providerID}</p>
            <p><strong>Action Type:</strong> ${request.actionType}</p>
            <p><strong>Request Data:</strong> ${JSON.stringify(request.requestData)}</p>
        `;

        const approveButton = document.createElement('button');
        approveButton.className = 'approve-button';
        approveButton.textContent = 'Approve';
        approveButton.onclick = () => {
            if (request.actionType === 'delete') {
                handleDeleteRequest(request.requestID, 'approved');
            } else {
                handleRequest(request.requestID, 'approved');
            }
        };

        const rejectButton = document.createElement('button');
        rejectButton.className = 'reject-button';
        rejectButton.textContent = 'Reject';
        rejectButton.onclick = () => rejectRequest(request.requestID, 'rejected');

        listItem.appendChild(requestInfo);
        listItem.appendChild(approveButton);
        listItem.appendChild(rejectButton);
        requestList.appendChild(listItem);
    });
}

async function handleRequest(requestID, status) {
    try {
        const response = await fetch(`http://localhost:8081/admin/handleRequest/${requestID}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message || 'Request handled successfully.');
            fetchPendingRequests(); // Refresh the list
        } else {
            alert(data.message || 'Failed to handle the request.');
        }
    } catch (error) {
        alert('Error handling the request.');
        console.error(error);
    }
}

async function handleDeleteRequest(requestID, status) {
    try {
        const response = await fetch(`http://localhost:8081/admin/handleDeleteRequest/${requestID}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message || 'Request handled successfully.');
            fetchPendingRequests(); // Refresh the list
        } else {
            alert(data.message || 'Failed to handle the request.');
        }
    } catch (error) {
        alert('Error handling the request.');
        console.error(error);
    }
}

async function rejectRequest(requestID, status) {
    try {
        const response = await fetch(`http://localhost:8081/admin/rejectRequest/${requestID}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message || 'Request rejected successfully.');
            fetchPendingRequests(); // Refresh the list
        } else {
            alert(data.message || 'Failed to reject the request.');
        }
    } catch (error) {
        alert('Error rejecting the request.');
        console.error(error);
    }
}

fetchPendingRequests();