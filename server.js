const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const session = require('express-session');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'", "'unsafe-inline'", "localhost:3000"],
            "img-src": ["'self'", "data:", "localhost:3000"],
            "style-src": ["'self'", "'unsafe-inline'"],
            "connect-src": ["'self'", "localhost:3000"],
            "font-src": ["'self'", "data:"],
            "object-src": ["'none'"],
            "form-action": ["'self'"],
            "frame-ancestors": ["'none'"],
        }
    },
    noSniff: false
}));

// Session Management
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware to check authentication
app.use((req, res, next) => {
    if (req.path === '/' || req.path.startsWith('/login') || req.path.startsWith('/goodbye') || req.path.startsWith('/public')) {
        return next();
    }
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/knowledge-platform', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define the Post schema and model
const PostSchema = new mongoose.Schema({
    content: String,
    author: String,
    date: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', PostSchema);

// API Routes
app.post('/api/posts', async (req, res) => {
    try {
        const newPost = new Post(req.body);
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to serve the login page
app.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/terra_numina');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
    }
});

// Route to handle the login logic
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Example authentication logic
    if (username === 'user' && password === 'pass') {
        req.session.user = { username };
        return res.status(200).json({ message: 'Login successful' });
    }

    res.status(401).json({ error: 'Invalid credentials' }); // Return JSON error response
});

// Route to handle logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.redirect('/goodbye');
    });
});

// Route to serve the goodbye page
app.get('/goodbye', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'goodbye.html'));
});

// Route to serve the authenticated page
app.get('/terra_numina', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'public', 'terra_numina.html'));
    } else {
        res.redirect('/login');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
