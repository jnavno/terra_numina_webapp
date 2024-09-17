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
const authMiddleware = require('./middleware/authMiddleware'); // Auth middleware

const app = express();
const port = 3000;
const allowedOrigins = [
    'https://terra-numina-web.vercel.app',
    'http://localhost:3000',
    'http://localhost:5500' // Add any other origins you use for development
];

// Middleware
app.use(cors({
    origin: allowedOrigins,
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
        secure: process.env.NODE_ENV === 'production' && process.env.USE_SECURE_COOKIES === 'true', // Set USE_SECURE_COOKIES to 'false' when testing locally
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));
// Force secure cookies in production when using HTTPS
// if (process.env.NODE_ENV === 'production') {
//     app.set('trust proxy', 1); // Trust first proxy
//     session.cookie.secure = true; // Serve secure cookies
// }

app.use((req, res, next) => {
    console.log('Session Middleware Check - Session ID:', req.sessionID);
    console.log('Session Middleware Check - Session Data:', req.session);
    next();
});

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
