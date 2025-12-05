// backend/routes/leaderboard.js

const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
// Note: This route does not require authentication

// @route GET /api/leaderboard
// @desc Get top users and their ratings
router.get('/', leaderboardController.getLeaderboard);

module.exports = router;