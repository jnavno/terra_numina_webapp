document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const formJSON = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(form.action, {
            method: form.method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formJSON),
            credentials: 'include'  //includding cookies in the request
        });

        if (response.ok) {
            window.location.href = '/terra_numina'; // Redirect on successful login
        } else {
            document.getElementById('loginError').style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loginError').textContent = 'An error occurred. Please try again later.';
        document.getElementById('loginError').style.display = 'block';
    }
});