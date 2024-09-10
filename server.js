const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Custom middlewares
const mongoMiddleware = require('./middleware/mongoMiddleware');
const authMiddleware = require('./middleware/authMiddleware'); // Auth middleware

const app = express();
const port = 3000;

// Middleware
app.use(cors({
    origin: 'https://terra-numina-web.vercel.app',
    credentials: true
}));
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
    secret: process.env.SESSION_SECRET || 'VvkZHT&bT*I0nthcivk2FkDsh', // Use environment variable or fallback to a default
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 }
}));

// Initializing MongoDB Connection (through middleware)
mongoMiddleware.connectMongoDB();

app.get('/test-db-connection', async (req, res) => {
    try {
        const result = await mongoose.connection.db.admin().ping();
        res.status(200).json({ message: 'Connected to MongoDB!', result });
    } catch (error) {
        res.status(500).json({ error: 'Connection failed!', details: error.message });
    }
});

// Routes
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Home Page Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Authentication Routes
app.get('/login', (req, res) => {
    if (req.session.user) {
        const userRole = req.session.user.role;
        return res.redirect(userRole === 'admin' ? '/admin-dashboard' : '/student-dashboard');
    }
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', authMiddleware.handleLogin);
app.get('/logout', authMiddleware.handleLogout);
app.get('/login-status', authMiddleware.checkLoginStatus);

// Secured Page Route
app.get('/terra_numina', authMiddleware.ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'terra_numina.html'));
});

// API Routes
app.use('/api/posts', authMiddleware.ensureAuthenticated); // Protect routes
app.post('/api/posts', async (req, res) => {
    try {
        const newPost = new mongoMiddleware.Post(req.body);
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/posts', async (req, res) => {
    try {
        const posts = await mongoMiddleware.Post.find().sort({ date: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
