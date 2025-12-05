// backend/routes/problems.js

const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');
const authMiddleware = require('../middleware/auth');

// All problem routes require authentication
router.use(authMiddleware);

// Route for creating a problem (Owner only)
// POST /api/galaxies/:id/problems
router.post('/:id/problems', problemController.createProblem);

// Route for getting all problems in a galaxy
// GET /api/galaxies/:id/problems
router.get('/:id/problems', problemController.getProblemsByGalaxy);

module.exports = router;