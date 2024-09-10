module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.session.user) return next();
        res.redirect('/login');
    },

    handleLogin: (req, res) => {
        const { username, password } = req.body;
        // Add login logic here
        if (username === 'user' && password === 'pass') {
            req.session.user = { username, role: 'student' }; // Example role
            return res.status(200).json({ message: 'Login successful' });
        }
        res.status(401).json({ error: 'Invalid credentials' });
    },

    handleLogout: (req, res) => {
        req.session.destroy(err => {
            if (err) return res.status(500).send('Could not log out.');
            res.redirect('/goodbye');
        });
    },

    checkLoginStatus: (req, res) => {
        res.status(200).json({ loggedIn: !!req.session.user });
    }
};
