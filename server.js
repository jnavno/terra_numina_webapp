const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

// Custom middlewares
const mongoMiddleware = require('./middleware/mongoMiddleware');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const port = process.env.PORT || 3000;

//Allow frontend to access backend
const allowedOrigins = [
    'https://terra-numina-web.vercel.app',
    'http://localhost:3000',
    'http://localhost:5500' // other development origins
];

//Serve static files FIRST
app.use(express.static(path.join(__dirname, 'public')));

//CORS settings
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

//Body parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "localhost:3000"],
            "img-src": ["'self'", "data:", "localhost:3000"],
            "style-src": ["'self'", "'unsafe-inline'", "localhost:3000"],
            "connect-src": ["'self'", "localhost:3000"],
            "font-src": ["'self'", "data:"],
            "object-src": ["'none'"],
            "form-action": ["'self'"],
            "frame-ancestors": ["'none'"],
        }
    },
    noSniff: false
}));

// MongoDB Connection
async function startServer() {
    try {
        await mongoMiddleware.connectMongoDB();
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Failed:', error.message);
        process.exit(1); // Stop the server if MongoDB fails
    }
}

startServer();

// Session Management
app.set('trust proxy', 1); // Trust first proxy if behind a proxy (like in production)
app.use(session({
    secret: process.env.NODE_ENV === 'production' ? process.env.SESSION_SECRET_PROD : process.env.SESSION_SECRET_LOCAL,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI_PROD : process.env.MONGODB_URI_LOCAL,
        collectionName: 'sessions'
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production' ? process.env.USE_SECURE_COOKIES === 'true' : false, // ✅ Fix secure cookie for localhost
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

// Debugging: Check if session works
app.use((req, res, next) => {
    console.log('Session Middleware Check - Session ID:', req.sessionID);
    console.log('Session Middleware Check - Session Data:', req.session);
    next();
});

// Test MongoDB connection
app.get('/test-db-connection', async (req, res) => {
    try {
        const result = await mongoose.connection.db.admin().ping();
        res.status(200).json({ message: 'Connected to MongoDB!', result });
    } catch (error) {
        res.status(500).json({ error: 'Connection failed!', details: error.message });
    }
});

// Authentication Routes
app.get('/login', (req, res) => {
    if (req.session.user && req.session.user.role) {
        return res.redirect(req.session.user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard');
    }
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', authMiddleware.handleLogin);
app.get('/logout', authMiddleware.handleLogout);
app.get('/login-status', authMiddleware.checkLoginStatus);

// Only Protect API Routes
app.use('/api/posts', authMiddleware.ensureAuthenticated);

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

//Home Page Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//Other Secured Pages
app.get('/terra_numina', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'terra_numina.html'));
});

app.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html'));
});

app.get('/student-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'student-dashboard.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
