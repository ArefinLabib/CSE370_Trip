// Get references to the elements
const addItemButton = document.getElementById('addItemButton');
const locationInput = document.getElementById('locationInput');
const hotelInput = document.getElementById('hotelInput');
const wishlist = document.getElementById('wishlist');
const emailInput = document.getElementById('emailInput');

// Load wishlist on page load
async function loadWishlist() {
  const userId = localStorage.getItem('Id'); // Assuming user ID is stored in localStorage

  try {
    const response = await fetch(`http://localhost:3000/wishlist?userId=${userId}`);
    const items = await response.json();

    wishlist.innerHTML = ''; // Clear current items
    items.forEach(item => {
      createListItem(item.locationName, item.hotel, userId);
    });
  } catch (error) {
    console.error('Error loading wishlist:', error);
    alert('Error loading wishlist');
  }
}

// Create a list item with delete functionality
function createListItem(location, hotel, userId) {
  const listItem = document.createElement('li');
  listItem.textContent = `Location: ${location}, Hotel: ${hotel}`;

  // Create a delete button for the list item
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('delete-btn');
  deleteButton.addEventListener('click', async function () {
    try {
      const deleteResponse = await fetch('http://localhost:3000/delete-item', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, location, hotel }),
      });

      const deleteData = await deleteResponse.json();
      if (deleteResponse.ok) {
        alert(deleteData.message);
        wishlist.removeChild(listItem);
      } else {
        alert(deleteData.message);
      }
    } catch (error) {
      console.error('Error deleting item from wishlist:', error);
      alert('Error deleting item from wishlist');
    }
  });

  listItem.appendChild(deleteButton);
  wishlist.appendChild(listItem);
}

// Event listener to add an item to the wishlist
addItemButton.addEventListener('click', async function () {
  const location = locationInput.value.trim();
  const hotel = hotelInput.value.trim();
  const userId = localStorage.getItem('Id'); // Assuming user ID is stored in localStorage

  if (location && hotel) {
    try {
      // Add item to the backend
      const response = await fetch('http://localhost:3000/add-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, location, hotel }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
      } else {
        alert('Item added to wishlist');
        // Optimistically update the UI
        createListItem(location, hotel, userId);
      }

      // Clear the input fields after adding
      locationInput.value = '';
      hotelInput.value = '';
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
      alert('Error adding item to wishlist');
    }
  } else {
    alert('Please enter both location and hotel name');
  }
});

// Event listener for the notification button
document.getElementById('notifyButton').addEventListener('click', async function () {
  const email = emailInput.value.trim();
  if (email) {
    try {
      const response = await fetch('http://localhost:3000/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        emailInput.value = ''; // Clear the email input
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error adding email for notifications:', error);
      alert('Error adding email for notifications');
    }
  } else {
    alert('Please enter your email to be notified');
  }
});

// Load wishlist on page load
loadWishlist();