// backend/routes/solutions.js

const express = require('express');
const router = express.Router();
const solutionController = require('../controllers/solutionController');
const authMiddleware = require('../middleware/auth');

// All solution routes require authentication
router.use(authMiddleware);

// Route for creating a solution
// POST /api/problems/:id/solutions
router.post('/:id/solutions', solutionController.createSolution);

// Route for getting all solutions for a problem
// GET /api/problems/:id/solutions
router.get('/:id/solutions', solutionController.getSolutionsByProblem);

// Route for rating a solution
// POST /api/solutions/:id/rate
router.post('/:id/rate', solutionController.rateSolution);

module.exports = router;