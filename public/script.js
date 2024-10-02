// Function to handle the posting form submission
function handlePostSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const titleInput = form.querySelector('#postTitle');
    const contentTextarea = form.querySelector('#postContent');

    const postTitle = titleInput.value.trim();
    const postContent = contentTextarea.value.trim();

    if (postTitle && postContent) {
        const postList = document.querySelector('.posts');

        // Create new post element
        const post = document.createElement('div');
        post.className = 'post';
        post.innerHTML = `
            <div class="post-left">
                <img src="images/placeholder_image_1.jpg" alt="Author Image" class="post-author-image">
                <div class="post-author">User</div>
            </div>
            <div class="post-right">
                <div class="post-date">${new Date().toLocaleDateString()}</div>
                <h3 class="post-title">${postTitle}</h3>
                <div class="post-content">${postContent}</div>
                <button class="delete-post">🗑️</button>
            </div>
        `;

        // Add the new post to the list
        if (postList) {
            postList.insertBefore(post, postList.firstChild);
        } else {
            console.error('Element with class "posts" not found');
        }

        // Save the new post to local storage
        savePost(postTitle, postContent);

        // Clear the form fields
        titleInput.value = '';
        contentTextarea.value = '';
    }
}

// Function to save a post to local storage
function savePost(title, content) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push({ title, content, date: new Date().toLocaleDateString() });
    localStorage.setItem('posts', JSON.stringify(posts));
}

// Function to delete a specific post
function deletePost(postElement) {
    const title = postElement.querySelector('.post-title').textContent;
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const updatedPosts = posts.filter(post => post.title !== title);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));

    postElement.remove();
}

// Function to load saved posts from local storage and display them
function loadPosts() {
    const postList = document.querySelector('.posts');

    if (!postList) {
        console.error('Element with class "posts" not found');
        return;
    }

    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    posts.forEach(postData => {
        const post = document.createElement('div');
        post.className = 'post';
        post.innerHTML = `
            <div class="post-left">
                <img src="images/placeholder_image_1.jpg" alt="Author Image" class="post-author-image">
                <div class="post-author">User</div>
            </div>
            <div class="post-right">
                <div class="post-date">${postData.date}</div>
                <h3 class="post-title">${postData.title}</h3>
                <div class="post-content">${postData.content}</div>
                <button class="delete-post">🗑️</button>
            </div>
        `;
        postList.appendChild(post);
    });

    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-post').forEach(button => {
        button.addEventListener('click', (event) => {
            const postElement = event.target.closest('.post');
            deletePost(postElement);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const currentPage = window.location.pathname;

    // Hide navbar on goodbye.html page
    if (currentPage.includes('goodbye.html')) {
        if (navbar) {
            navbar.style.display = 'none';
        }
    }

    // Add event listener to the logout button to ensure proper logout
    const logoutButton = document.querySelector('a[href="/goodbye.html"]');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            fetch('/logout', {
                method: 'GET',
                credentials: 'include'
            })
            .then(response => {
                if (response.ok) {
                    // Clear any local session-related data (e.g., localStorage)
                    localStorage.clear();
                    // Redirect to goodbye page on successful logout
                    window.location.href = '/goodbye.html';
                } else {
                    console.error('Logout failed:', response.statusText);
                }
            })
            .catch(error => console.error('Error during logout:', error));
        });
    }

    // Check login status and toggle login/logout buttons
    fetch('/login-status', {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        const loginButton = document.querySelector('a[href="/login"]');
        const logoutLink = document.querySelector('a[href="goodbye.html"]');
        const terraNuminaButton = document.querySelector('a[href="/terra_numina"]');
        const accountButton = document.querySelector('a[href="account.html"]');
        const practiceButton = document.querySelector('a[href="practice.html"]');
        
        if (data.loggedIn) {
            if (loginButton) loginButton.style.display = 'none'; // Hide login button
            if (logoutLink) logoutLink.style.display = 'block'; // Show logout button
            if (terraNuminaButton) terraNuminaButton.style.display = 'block'; // Show Terra Numina button
            if (accountButton) accountButton.style.display = 'block'; // Show account button
            if (practiceButton) practiceButton.style.display = 'block'; // Show practice space button
        } else {
            if (loginButton) loginButton.style.display = 'block'; // Show login button
            if (logoutLink) logoutLink.style.display = 'none'; // Hide logout link
            if (terraNuminaButton) terraNuminaButton.style.display = 'none'; // Hide Terra Numina button
            if (accountButton) accountButton.style.display = 'none'; // Hide account button
            if (practiceButton) practiceButton.style.display = 'none'; // Hide practice space button
        }
    })
    .catch(error => console.error('Error fetching login status:', error));

    // Handle post form submission and other post-related functionalities
    const postForm = document.querySelector('#postForm');
    if (postForm) {
        postForm.addEventListener('submit', handlePostSubmit);
    }

    // Load posts from local storage
    loadPosts();
});
