// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
// Assume validationMiddleware is implemented in ../middleware/validation.js

// @route POST /api/auth/register
// @desc Register user
router.post('/register', authController.register);

// @route POST /api/auth/login
// @desc Login user
router.post('/login', authController.login);

// @route GET /api/auth/me
// @desc Get current user details
// @access Private
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;