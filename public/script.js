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

async function checkLoginStatus() {
    try {
        const response = await fetch('/login-status');
        const data = await response.json();

        if (!data.isAuthenticated) {
            window.location.href = '/login'; // Redirect if not logged in
        }
    } catch (error) {
        console.error('Error checking login status:', error);
    }
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

document.addEventListener("DOMContentLoaded", function () {
    const pageHeader = document.querySelector(".page-header");
    const content = document.querySelector(".container") || document.querySelector(".index-container");
    const galleryContainer = document.querySelector(".gallery-container");
    const galleryTrack = document.querySelector(".gallery-track");

    if (pageHeader) {
        const imageUrl = pageHeader.getAttribute("data-image");
        const imageOffset = pageHeader.getAttribute("data-offset") || "0px"; // Default to no movement
        const customHeight = pageHeader.getAttribute("data-height") || "600px"; // Default to 600px if not provided

        // ✅ Set background image for header
        if (imageUrl) {
            pageHeader.style.backgroundImage = `url(${imageUrl})`;
            pageHeader.style.backgroundSize = "cover";
            pageHeader.style.backgroundRepeat = "no-repeat";
            pageHeader.style.backgroundPosition = `center ${imageOffset}`;
        }

        // ✅ Ensure header and gallery elements have proper height
        pageHeader.style.height = customHeight;
        if (galleryContainer) galleryContainer.style.height = customHeight;
        if (galleryTrack) galleryTrack.style.height = customHeight;

        // ✅ Ensure images adjust properly within the gallery
        const images = document.querySelectorAll(".gallery-track img");
        images.forEach(img => {
            img.style.height = "100%";
            img.style.width = "auto";
            img.style.objectFit = "contain"; // Prevents cropping
        });

        // ✅ Ensure content starts DIRECTLY BELOW the header
        if (content) {
            function updateMargin() {
                const headerHeight = pageHeader.offsetHeight;
                content.style.marginTop = `${headerHeight}px`; // Match header height
            }

            updateMargin(); // Set on page load
            window.addEventListener("resize", updateMargin); // Adjust on window resize
        }

        // ✅ Fix unwanted white spaces
        document.body.style.margin = "0";
        document.body.style.padding = "0";

        // ✅ Enable full-page scrolling without extra gaps
        document.documentElement.style.overflowY = "auto";
        document.documentElement.style.height = "100%"; 
        document.body.style.height = "100%"; 

        // ✅ Ensure `.container` takes only the necessary space
        if (content) {
            content.style.minHeight = `calc(100vh - ${pageHeader.offsetHeight}px)`;
        }
    }
});




document.addEventListener("DOMContentLoaded", function () {
    const pageHeader = document.querySelector(".page-header");
    const content = document.querySelector(".container") || document.querySelector(".index-container");

    if (pageHeader && content) {
        function updateMargin() {
            const headerHeight = pageHeader.offsetHeight;
            content.style.marginTop = `${headerHeight}px`; // Ensure it starts just below the header
        }

        updateMargin(); // Apply on page load
        window.addEventListener("resize", updateMargin); // Adjust on window resize
    }
});




// Auto-Scroll Gallery Sliding Effect

document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelectorAll(".gallery-track img");
    const dots = document.querySelectorAll(".dot");
    let index = 0;

    function showSlide(n) {
        slides.forEach((slide, i) => {
            slide.style.opacity = i === n ? "1" : "0";
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === n);
        });
    }

    function nextSlide() {
        index = (index + 1) % slides.length;
        showSlide(index);
    }

    function prevSlide() {
        index = (index - 1 + slides.length) % slides.length;
        showSlide(index);
    }

    function goToSlide(n) {
        index = n;
        showSlide(index);
    }

    setInterval(nextSlide, 4000); // Auto-change every 4 sec
    showSlide(index);
});
