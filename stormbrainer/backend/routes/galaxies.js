// backend/routes/galaxies.js

const express = require('express');
const router = express.Router();
const galaxyController = require('../controllers/galaxyController');
const authMiddleware = require('../middleware/auth');

// All galaxy routes require authentication
router.use(authMiddleware);

// @route GET /api/galaxies
// @desc Get list of public/joined galaxies
router.get('/', galaxyController.getGalaxies);

// @route POST /api/galaxies
// @desc Create a new galaxy
router.post('/', galaxyController.createGalaxy);

// @route POST /api/galaxies/:id/join
// @desc Join a specific galaxy
router.post('/:id/join', galaxyController.joinGalaxy);

module.exports = router;