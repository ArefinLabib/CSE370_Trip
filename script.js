// Select all the stars and initialize variables
const stars = document.querySelectorAll('.ratings i');
let selectedRating = 0;

// Add click event listeners to each star
stars.forEach((star, index) => {
    star.addEventListener('click', () => {
        // Update the selected rating
        selectedRating = index + 1;

        // Update the UI
        stars.forEach((s, i) => {
            if (i < selectedRating) {
                s.classList.add('selected');
            } else {
                s.classList.remove('selected');
            }
        });
    });

    // Add hover effect
    star.addEventListener('mouseover', () => {
        stars.forEach((s, i) => {
            if (i <= index) {
                s.style.color = '#ffc107'; // Highlight on hover
            } else {
                s.style.color = '#ccc';
            }
        });
    });

    // Remove hover effect
    star.addEventListener('mouseout', () => {
        stars.forEach((s, i) => {
            if (i < selectedRating) {
                s.style.color = '#ffc107';
            } else {
                s.style.color = '#ccc';
            }
        });
    });
});

// Submit feedback button functionality
const feedbackButton = document.getElementById('submit-feedback');
feedbackButton.addEventListener('click', () => {
    const reviewText = document.querySelector('textarea').value.trim();
    if (selectedRating === 0) {
        alert('Please select a rating!');
    } else if (reviewText === '') {
        alert('Please write a review!');
    } else {
        alert(`Thank you for your feedback!\nRating: ${selectedRating}\nReview: ${reviewText}`);
    }
});
