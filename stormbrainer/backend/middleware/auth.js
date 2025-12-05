// backend/middleware/auth.js

const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');
const { query } = require('../config/database');

/**
 * @description Middleware to verify JWT token and attach user to request object.
 */
module.exports = async (req, res, next) => {
    try {
        // 1. Check for token in header (Bearer token)
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        // 2. Verify token
        const decoded = jwt.verify(token, secret);

        // 3. Attach user payload to request (simple approach)
        req.user = decoded; 
        
        // OPTIONAL: Fetch user from DB to ensure they still exist and attach full object
        const userResult = await query('SELECT id, username, rating FROM users WHERE id = $1', [decoded.id]);
        if (userResult.rows.length === 0) {
             return res.status(401).json({ message: 'Access denied. User no longer exists.' });
        }
        req.user = userResult.rows[0];
        
        next();

    } catch (ex) {
        // Handle token expiration or invalid signature
        res.status(401).json({ message: 'Invalid token.' });
    }
};