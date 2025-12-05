// backend/controllers/problemController.js

const { query } = require('../config/database');

/**
 * @route POST /api/galaxies/:id/problems
 * @desc Create a new problem in a galaxy (Owner only)
 * @access Private
 */
exports.createProblem = async (req, res, next) => {
    const galaxy_id = req.params.id;
    const { title, description } = req.body;
    const creator_id = req.user.id; 

    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required for a problem.' });
    }

    try {
        // 1. Verify that the current user is the owner of the galaxy
        const galaxyResult = await query(
            'SELECT owner_id, name FROM galaxies WHERE id = $1',
            [galaxy_id]
        );
        const galaxy = galaxyResult.rows[0];

        if (!galaxy) {
            return res.status(404).json({ message: 'Galaxy not found.' });
        }
        if (galaxy.owner_id !== creator_id) {
            return res.status(403).json({ message: 'Only the galaxy owner can create new problems.' });
        }

        // 2. Insert the new problem
        const result = await query(
            'INSERT INTO problems (galaxy_id, title, description, creator_id) VALUES ($1, $2, $3, $4) RETURNING id, galaxy_id, title, description, creator_id, stars, created_at',
            [galaxy_id, title, description, creator_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

/**
 * @route GET /api/galaxies/:id/problems
 * @desc Get all problems for a specific galaxy
 * @access Private (must be a member)
 */
exports.getProblemsByGalaxy = async (req, res, next) => {
    const galaxy_id = req.params.id;
    const user_id = req.user.id;

    try {
        // 1. Check if user is a member of the galaxy
        const memberCheck = await query(
            'SELECT 1 FROM galaxy_members WHERE galaxy_id = $1 AND user_id = $2',
            [galaxy_id, user_id]
        );
        if (memberCheck.rows.length === 0) {
            return res.status(403).json({ message: 'You must be a member to view problems in this galaxy.' });
        }

        // 2. Fetch all problems in the galaxy
        const result = await query(
            'SELECT id, title, description, stars, created_at, creator_id FROM problems WHERE galaxy_id = $1 ORDER BY created_at DESC',
            [galaxy_id]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        next(error);
    }
};