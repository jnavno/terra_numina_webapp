// signup.js
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');

    signupForm.addEventListener('submit', (event) => {
        const password = document.getElementById('password').value;
        
        // Basic password validation
        const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!passwordPattern.test(password)) {
            alert('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.');
            event.preventDefault(); // Prevent form submission
        }
    });
});
