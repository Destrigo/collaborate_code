// backend/controllers/galaxyController.js

const { query } = require('../config/database');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10; // For password hashing

/**
 * @route POST /api/galaxies
 * @desc Create a new galaxy (private or public)
 * @access Private
 */
exports.createGalaxy = async (req, res, next) => {
    const { name, description, category, is_public, password } = req.body;
    const owner_id = req.user.id; // Set by auth middleware

    // Simple validation
    if (!name || !category) {
        return res.status(400).json({ message: 'Galaxy name and category are required.' });
    }

    let password_hash = null;
    if (!is_public && password) {
        password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    } else if (!is_public && !password) {
        return res.status(400).json({ message: 'Private galaxies require a password.' });
    }

    try {
        // 1. Create the new galaxy
        const result = await query(
            `INSERT INTO galaxies (name, description, category, is_public, password_hash, owner_id)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, name, description, category, is_public, owner_id`,
            [name, description, category, is_public, password_hash, owner_id]
        );
        const newGalaxy = result.rows[0];

        // 2. Automatically add the creator as a member
        await query(
            'INSERT INTO galaxy_members (galaxy_id, user_id) VALUES ($1, $2)',
            [newGalaxy.id, owner_id]
        );

        res.status(201).json({ ...newGalaxy, owner_username: req.user.username });
    } catch (error) {
        next(error);
    }
};

/**
 * @route GET /api/galaxies
 * @desc Get all public galaxies and optionally, user's joined galaxies
 * @access Private
 */
exports.getGalaxies = async (req, res, next) => {
    const userId = req.user.id;
    const { filter } = req.query; // 'public' or 'joined' (default to public for browsing)

    try {
        let sql = `
            SELECT 
                g.id, g.name, g.description, g.category, g.is_public, g.owner_id, 
                u.username AS owner_username,
                gm.user_id IS NOT NULL AS is_member
            FROM galaxies g
            JOIN users u ON g.owner_id = u.id
            LEFT JOIN galaxy_members gm ON g.id = gm.galaxy_id AND gm.user_id = $1
        `;
        const params = [userId];

        if (filter === 'joined') {
            // Only show galaxies the user has joined (excluding public ones they might not have explicitly joined yet)
            sql += ' WHERE gm.user_id IS NOT NULL ORDER BY g.created_at DESC';
        } else {
            // Default: Show all public galaxies + any private ones the user is a member of
            sql += ' WHERE g.is_public = TRUE OR gm.user_id IS NOT NULL ORDER BY g.created_at DESC';
        }

        const result = await query(sql, params);
        res.status(200).json(result.rows);
    } catch (error) {
        next(error);
    }
};

/**
 * @route POST /api/galaxies/:id/join
 * @desc Join a public or private galaxy
 * @access Private
 */
exports.joinGalaxy = async (req, res, next) => {
    const galaxy_id = req.params.id;
    const user_id = req.user.id;
    const { password } = req.body;

    try {
        // 1. Check if user is already a member
        const isMember = await query(
            'SELECT 1 FROM galaxy_members WHERE galaxy_id = $1 AND user_id = $2',
            [galaxy_id, user_id]
        );
        if (isMember.rows.length > 0) {
            return res.status(200).json({ message: 'Already a member of this galaxy.' });
        }

        // 2. Get galaxy details to check privacy and password
        const galaxyResult = await query(
            'SELECT is_public, password_hash, name FROM galaxies WHERE id = $1',
            [galaxy_id]
        );
        const galaxy = galaxyResult.rows[0];

        if (!galaxy) {
            return res.status(404).json({ message: 'Galaxy not found.' });
        }

        if (!galaxy.is_public) {
            // Private galaxy requires password check
            if (!password || !galaxy.password_hash) {
                return res.status(401).json({ message: 'This is a private galaxy. Password required.' });
            }
            const isMatch = await bcrypt.compare(password, galaxy.password_hash);
            if (!isMatch) {
                return res.status(401).json({ message: 'Incorrect password for this private galaxy.' });
            }
        }

        // 3. Add user to galaxy members
        await query(
            'INSERT INTO galaxy_members (galaxy_id, user_id) VALUES ($1, $2)',
            [galaxy_id, user_id]
        );

        res.status(200).json({ message: `Successfully joined galaxy: ${galaxy.name}.` });
    } catch (error) {
        next(error);
    }
};