// Get references to the elements
const addItemButton = document.getElementById('addItemButton');
const locationInput = document.getElementById('locationInput');
const hotelInput = document.getElementById('hotelInput');
const wishlist = document.getElementById('wishlist');
const deleteItemButton = document.getElementById('DEleteItemButton');
const emailInput = document.getElementById('emailInput');

// Event listener to add an item to the wishlist
addItemButton.addEventListener('click', function() {
  const location = locationInput.value.trim();
  const hotel = hotelInput.value.trim();
  
  if (location && hotel) {
    // Create a new list item
    const listItem = document.createElement('li');
    listItem.textContent = `Location: ${location}, Hotel: ${hotel}`;
    
    // Create a delete button for the list item
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', function() {
      wishlist.removeChild(listItem);
    });
    
    // Append the delete button to the list item and then append the list item to the wishlist
    listItem.appendChild(deleteButton);
    wishlist.appendChild(listItem);
    
    // Clear the input fields after adding
    locationInput.value = '';
    hotelInput.value = '';
  } else {
    alert('Please enter both location and hotel name');
  }
});

// Event listener for the notification button
document.getElementById('notifyButton').addEventListener('click', function() {
  const email = emailInput.value.trim();
  if (email) {
    alert(`You will be notified at ${email} about discounts.`);
    emailInput.value = ''; // Clear the email input
  } else {
    alert('Please enter your email to be notified');
  }
});
