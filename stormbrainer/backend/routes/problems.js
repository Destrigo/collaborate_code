// backend/routes/problems.js

const express = require('express');
const router = express.Router();
const solutionController = require('../controllers/solutionController');
const authenticateToken = require('../middleware/auth');
const { validateSolution } = require('../middleware/validation'); // (Assuming you added solution validation to validation.js)

// Apply auth middleware to all routes in this router
router.use(authenticateToken); 

// GET /api/problems/:problemId/solutions - Get solutions for a problem
router.get('/:problemId/solutions', solutionController.getSolutionsByProblem);

// POST /api/problems/:problemId/solutions - Create a new solution
router.post('/:problemId/solutions', solutionController.createSolution); // Add validateSolution middleware here if implemented

module.exports = router;