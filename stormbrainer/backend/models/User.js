// backend/models/User.js

const { query } = require('../config/database'); // Assuming query is exported

// Model is used to encapsulate database logic for the User resource
class User {
    /**
     * Finds a user by email, including the password hash.
     * @param {string} email
     */
    static async findByEmail(email) {
        const result = await query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    }

    /**
     * Finds a user by ID, excluding the password hash.
     * @param {number} id
     */
    static async findById(id) {
        const result = await query(
            'SELECT id, email, username, rating, created_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }
    
    // ... other user-related database methods can be added here
}

module.exports = User;