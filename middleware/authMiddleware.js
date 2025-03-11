module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.session.user && req.session.user) {
            return next(); // User is logged in, so continue to the requested route
        }
        req.session.destroy();
        res.clearCookie('connect.sid');
        res.redirect('/login'); // Redirect to login if the user is not authenticated
    },

    handleLogin: (req, res) => {
        const { username, password } = req.body;

        // Basic authentication check (you can make this more complex later)
        if (username === 'user' && password === 'pass') {
            req.session.user = { username, role: 'student' }; // Set user session data
            console.log('Login successful:', req.session.user); // Debugging
            return res.redirect('/terra_numina'); // Redirect user to a protected page after login
        }

        res.status(401).json({ error: 'Invalid credentials' }); // If credentials are wrong
    },

    handleLogout: (req, res) => {
        req.session.destroy(err => {
            if (err) return res.status(500).send('Could not log out.');
            res.clearCookie('connect.sid');
            res.redirect('/goodbye.html');
        });
    },

    checkLoginStatus: (req, res) => {
        console.log('Session ID:', req.sessionID);
        console.log('Session Data:', req.session);
        res.status(200).json({ loggedIn: !!req.session.user });
    }
};
