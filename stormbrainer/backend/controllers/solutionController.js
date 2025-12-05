// backend/controllers/solutionController.js

const { query } = require('../config/database');

/**
 * @route POST /api/problems/:id/solutions
 * @desc Create a new solution for a problem
 * @access Private
 */
exports.createSolution = async (req, res, next) => {
    const problem_id = req.params.id;
    const { text } = req.body;
    const author_id = req.user.id; 

    if (!text) {
        return res.status(400).json({ message: 'Solution text is required.' });
    }

    try {
        // 1. Get the galaxy_id to check membership
        const problemResult = await query(
            'SELECT galaxy_id FROM problems WHERE id = $1',
            [problem_id]
        );
        const problem = problemResult.rows[0];

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found.' });
        }
        
        // 2. Check if user is a member of the galaxy (required to post a solution)
        const memberCheck = await query(
            'SELECT 1 FROM galaxy_members WHERE galaxy_id = $1 AND user_id = $2',
            [problem.galaxy_id, author_id]
        );
        if (memberCheck.rows.length === 0) {
            return res.status(403).json({ message: 'You must be a member of the galaxy to post a solution.' });
        }

        // 3. Insert the new solution
        const result = await query(
            'INSERT INTO solutions (problem_id, author_id, text) VALUES ($1, $2, $3) RETURNING id, problem_id, author_id, text, stars, created_at',
            [problem_id, author_id, text]
        );
        
        // Fetch author username for frontend display
        const author = await query('SELECT username FROM users WHERE id = $1', [author_id]);

        res.status(201).json({ ...result.rows[0], author_username: author.rows[0].username });
    } catch (error) {
        next(error);
    }
};

/**
 * @route GET /api/problems/:id/solutions
 * @desc Get all solutions for a specific problem
 * @access Private (assumes user is a member via prior check)
 */
exports.getSolutionsByProblem = async (req, res, next) => {
    const problem_id = req.params.id;

    try {
        // Fetch solutions along with author's username
        const result = await query(
            `SELECT 
                s.id, s.problem_id, s.author_id, s.text, s.stars, s.created_at, 
                u.username AS author_username
             FROM solutions s
             JOIN users u ON s.author_id = u.id
             WHERE s.problem_id = $1
             ORDER BY s.stars DESC, s.created_at ASC`,
            [problem_id]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        next(error);
    }
};

/**
 * @route POST /api/solutions/:id/rate
 * @desc Rate a solution (+1 star)
 * @access Private
 */
exports.rateSolution = async (req, res, next) => {
    const solution_id = req.params.id;
    const user_id = req.user.id;
    // value is assumed to be 1 for a "star" rating based on requirement 3.
    const value = 1; 

    try {
        // 1. Check if the user has already rated this solution
        const existingRating = await query(
            'SELECT id, value FROM ratings WHERE solution_id = $1 AND user_id = $2',
            [solution_id, user_id]
        );

        if (existingRating.rows.length > 0) {
            // User has already rated, prevent duplicate rating (or allow un-rating, but sticking to simple one-time star)
            return res.status(400).json({ message: 'You have already rated this solution.' });
        }

        // 2. Start a transaction for integrity
        await query('BEGIN');

        // 3. Insert the new rating record
        await query(
            'INSERT INTO ratings (solution_id, user_id, value) VALUES ($1, $2, $3)',
            [solution_id, user_id, value]
        );

        // 4. Update the solution's star count
        const updateSolution = await query(
            'UPDATE solutions SET stars = stars + $1 WHERE id = $2 RETURNING author_id, stars',
            [value, solution_id]
        );
        const { author_id, stars: newSolutionStars } = updateSolution.rows[0];

        // 5. Update the author's global rating
        await query(
            'UPDATE users SET rating = rating + $1 WHERE id = $2',
            [value, author_id]
        );
        
        // 6. Commit transaction
        await query('COMMIT');

        // 7. Fetch the updated solution and author username
        const updatedSolutionResult = await query(
            `SELECT 
                s.id, s.problem_id, s.author_id, s.text, s.stars, s.created_at, 
                u.username AS author_username
             FROM solutions s
             JOIN users u ON s.author_id = u.id
             WHERE s.id = $1`,
            [solution_id]
        );

        res.status(200).json(updatedSolutionResult.rows[0]);

    } catch (error) {
        await query('ROLLBACK'); // Rollback on any error
        next(error);
    }
};