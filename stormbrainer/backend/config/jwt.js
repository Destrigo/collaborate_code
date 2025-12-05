// backend/config/jwt.js

require('dotenv').config({ path: '../.env' });

/**
 * @description Configuration constants for JSON Web Tokens.
 */
module.exports = {
    secret: process.env.JWT_SECRET || 'a_strong_default_secret_please_change_in_production',
    expiresIn: '7d' // Token expires in 7 days
};