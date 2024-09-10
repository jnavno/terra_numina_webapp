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

// Add event listener to the post form
const postForm = document.querySelector('#postForm');
if (postForm) {
    postForm.addEventListener('submit', handlePostSubmit);
}


// Check login status and toggle login/logout buttons
document.addEventListener('DOMContentLoaded', () => {
    fetch('/login-status')
        .then(response => response.json())
        .then(data => {
            const loginButton = document.querySelector('a[href="login.html"]');
            const logoutButton = document.querySelector('a[href="logout.html"]');
            const terraNuminaButton = document.querySelector('a[href="terra_numina.html"]');
            
            if (data.loggedIn) {
                if (loginButton) loginButton.style.display = 'none'; // Hide login button
                if (logoutButton) logoutButton.style.display = 'block'; // Show logout button
                if (terraNuminaButton) terraNuminaButton.style.display = 'block'; // Show Terra Numina button
            } else {
                if (loginButton) loginButton.style.display = 'block'; // Show login button
                if (logoutButton) logoutButton.style.display = 'none'; // Hide logout button
                if (terraNuminaButton) terraNuminaButton.style.display = 'none'; // Hide Terra Numina button
            }
        })
        .catch(error => console.error('Error fetching login status:', error));
});