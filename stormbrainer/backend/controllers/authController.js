// backend/controllers/authController.js

const { query } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt');

// Helper to generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, secret, { expiresIn });
};

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 */
exports.register = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        // 1. Check if user already exists
        const checkUser = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (checkUser.rows.length > 0) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        // 2. Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // 3. Insert new user
        const result = await query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, rating',
            [username, email, password_hash]
        );

        const newUser = result.rows[0];
        
        // 4. Generate token and respond
        const token = generateToken(newUser.id);

        res.status(201).json({ 
            message: 'Registration successful!', 
            token, 
            user: { 
                id: newUser.id, 
                username: newUser.username, 
                email: newUser.email, 
                rating: newUser.rating 
            } 
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route POST /api/auth/login
 * @desc Authenticate user and return JWT
 */
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // 1. Find user by email
        const result = await query('SELECT id, username, email, password_hash, rating FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // 2. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // 3. Generate token and respond
        const token = generateToken(user.id);
        
        res.status(200).json({
            token,
            user: { 
                id: user.id, 
                username: user.username, 
                email: user.email, 
                rating: user.rating 
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @route GET /api/auth/me
 * @desc Get current authenticated user's details
 * @middleware auth.js (requires token)
 */
exports.getMe = async (req, res, next) => {
    try {
        // req.user is set by the auth middleware
        const userId = req.user.id; 
        
        const result = await query('SELECT id, username, email, rating FROM users WHERE id = $1', [userId]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};