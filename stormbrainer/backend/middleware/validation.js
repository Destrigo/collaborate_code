// backend/middleware/validation.js

// Middleware for validating registration input
exports.validateRegister = (req, res, next) => {
    const { email, password, username } = req.body;
    
    if (!email || !password || !username) {
        return res.status(400).json({ error: 'All fields (email, password, username) are required.' });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    next();
};

// Middleware for validating login input
exports.validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    
    next();
};

// Middleware for validating problem creation input
exports.validateProblem = (req, res, next) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: 'Problem title and description are required.' });
    }
    
    if (title.length < 10 || description.length < 50) {
        return res.status(400).json({ error: 'Title must be at least 10 characters and description at least 50.' });
    }
    
    next();
};