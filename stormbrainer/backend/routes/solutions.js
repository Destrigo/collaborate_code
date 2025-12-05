// backend/routes/solutions.js (Renamed from solution.js)

const express = require('express');
const router = express.Router();
const solutionController = require('../controllers/solutionController');
const authenticateToken = require('../middleware/auth');

// POST /api/solutions/:solutionId/rate - Route to rate a solution
router.post('/:solutionId/rate', authenticateToken, solutionController.rateSolution);

module.exports = router;