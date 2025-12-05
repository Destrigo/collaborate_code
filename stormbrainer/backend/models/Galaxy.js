// backend/models/Galaxy.js

const { query } = require('../config/database'); 

// Model used to encapsulate database logic for the Galaxy resource
class Galaxy {
    /**
     * Finds a single galaxy and includes member/owner status.
     * @param {number} galaxyId
     * @param {number} userId - The ID of the currently logged-in user
     */
    static async findByIdWithStats(galaxyId, userId) {
        const result = await query(`
            SELECT 
                g.*,
                u.username as owner_name,
                COUNT(DISTINCT gm.user_id) as member_count,
                BOOL_OR(gm.user_id = $2) as is_member
            FROM galaxies g
            LEFT JOIN users u ON g.owner_id = u.id
            LEFT JOIN galaxy_members gm ON g.id = gm.galaxy_id
            WHERE g.id = $1
            GROUP BY g.id, u.username
        `, [galaxyId, userId]);

        return result.rows[0];
    }
    
    // ... other galaxy-related database methods can be added here
}

module.exports = Galaxy;