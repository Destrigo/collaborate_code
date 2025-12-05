// backend/controllers/leaderboardController.js

const { query } = require('../config/database');

/**
 * @route GET /api/leaderboard
 * @desc Get the top users based on their global rating
 * @access Public (Can be viewed by anyone, logged in or not)
 */
exports.getLeaderboard = async (req, res, next) => {
    try {
        // Fetch users ordered by their global rating score, descending.
        // Limit the results to a reasonable number, e.g., Top 50.
        const result = await query(
            'SELECT id, username, rating FROM users ORDER BY rating DESC LIMIT 50'
        );

        // Map the results to assign a rank based on their order in the query.
        const leaderboardData = result.rows.map((user, index) => ({
            rank: index + 1,
            id: user.id,
            username: user.username,
            rating: user.rating,
        }));

        res.status(200).json(leaderboardData);

    } catch (error) {
        next(error);
    }
};