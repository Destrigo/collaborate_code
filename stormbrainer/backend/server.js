// backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { pool } = require('./config/database'); // Ensure DB connection is initiated

const authRoutes = require('./routes/auth');
const galaxyRoutes = require('./routes/galaxies');
const problemRoutes = require('./routes/problems'); 
const solutionRoutes = require('./routes/solutions'); 
const leaderboardRoutes = require('./routes/leaderboard');
const errorHandler = require('./middleware/errorHandler'); 

const app = express();
const PORT = 'PLACEHOLDER_PORT'; // Redacted Port Number

// Middleware
app.use(cors({ origin: 'https://stormbrainer-galaxy.onrender.com' })); // Redacted CORS Origin
app.use(express.json()); // Body parser

// Root Check
app.get('/', (req, res) => {
    res.send('StormBrainer Backend is running.');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/galaxies', galaxyRoutes); 
app.use('/api/galaxies', problemRoutes); 
app.use('/api/problems', solutionRoutes); 
app.use('/api/solutions', solutionRoutes); 
app.use('/api/leaderboard', leaderboardRoutes);

// Global Error Handler (must be last middleware)
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`🌌 Server running on port ${PORT}`);
});


// // server.js - Main Express Server
// const express = require('express');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const { Pool } = require('pg');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Database connection
// const pool = new Pool({
//   user: process.env.DB_USER || 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   database: process.env.DB_NAME || 'stormbrainer',
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT || 5432,
// });

// // Middleware
// app.use(cors());
// app.use(express.json());

// // JWT Secret
// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// // Auth Middleware
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ error: 'Access denied. No token provided.' });
//   }

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ error: 'Invalid or expired token.' });
//     }
//     req.user = user;
//     next();
//   });
// };

// // ============================================
// // AUTH ROUTES
// // ============================================

// // Register
// app.post('/api/auth/register', async (req, res) => {
//   const { email, password, username } = req.body;

//   try {
//     // Validate input
//     if (!email || !password || !username) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     // Check if user exists
//     const userExists = await pool.query(
//       'SELECT * FROM users WHERE email = $1',
//       [email]
//     );

//     if (userExists.rows.length > 0) {
//       return res.status(400).json({ error: 'Email already registered' });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const passwordHash = await bcrypt.hash(password, salt);

//     // Create user
//     const result = await pool.query(
//       'INSERT INTO users (email, password_hash, username, rating) VALUES ($1, $2, $3, 0) RETURNING id, email, username, rating, created_at',
//       [email, passwordHash, username]
//     );

//     const user = result.rows[0];

//     // Generate JWT
//     const token = jwt.sign(
//       { id: user.id, email: user.email },
//       JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.status(201).json({ user, token });
//   } catch (error) {
//     console.error('Register error:', error);
//     res.status(500).json({ error: 'Server error during registration' });
//   }
// });

// // Login
// app.post('/api/auth/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Validate input
//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email and password are required' });
//     }

//     // Find user
//     const result = await pool.query(
//       'SELECT * FROM users WHERE email = $1',
//       [email]
//     );

//     if (result.rows.length === 0) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const user = result.rows[0];

//     // Verify password
//     const validPassword = await bcrypt.compare(password, user.password_hash);
//     if (!validPassword) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // Generate JWT
//     const token = jwt.sign(
//       { id: user.id, email: user.email },
//       JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     // Remove password from response
//     delete user.password_hash;

//     res.json({ user, token });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ error: 'Server error during login' });
//   }
// });

// // Get current user
// app.get('/api/auth/me', authenticateToken, async (req, res) => {
//   try {
//     const result = await pool.query(
//       'SELECT id, email, username, rating, created_at FROM users WHERE id = $1',
//       [req.user.id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Get user error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // ============================================
// // GALAXY ROUTES
// // ============================================

// // Get all galaxies (user's galaxies + public galaxies)
// app.get('/api/galaxies', authenticateToken, async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT 
//         g.*,
//         u.username as owner_name,
//         COUNT(DISTINCT gm.user_id) as member_count,
//         BOOL_OR(gm.user_id = $1) as is_member
//       FROM galaxies g
//       LEFT JOIN users u ON g.owner_id = u.id
//       LEFT JOIN galaxy_members gm ON g.id = gm.galaxy_id
//       WHERE g.is_public = true OR gm.user_id = $1 OR g.owner_id = $1
//       GROUP BY g.id, u.username
//       ORDER BY g.created_at DESC
//     `, [req.user.id]);

//     res.json(result.rows);
//   } catch (error) {
//     console.error('Get galaxies error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Get single galaxy
// app.get('/api/galaxies/:id', authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;

//     const result = await pool.query(`
//       SELECT 
//         g.*,
//         u.username as owner_name,
//         COUNT(DISTINCT gm.user_id) as member_count,
//         BOOL_OR(gm.user_id = $1) as is_member
//       FROM galaxies g
//       LEFT JOIN users u ON g.owner_id = u.id
//       LEFT JOIN galaxy_members gm ON g.id = gm.galaxy_id
//       WHERE g.id = $2
//       GROUP BY g.id, u.username
//     `, [req.user.id, id]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Galaxy not found' });
//     }

//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Get galaxy error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Create galaxy
// app.post('/api/galaxies', authenticateToken, async (req, res) => {
//   const { name, description, isPublic, password, category } = req.body;

//   try {
//     // Validate input
//     if (!name || !category) {
//       return res.status(400).json({ error: 'Name and category are required' });
//     }

//     let passwordHash = null;
//     if (!isPublic && password) {
//       const salt = await bcrypt.genSalt(10);
//       passwordHash = await bcrypt.hash(password, salt);
//     }

//     // Create galaxy
//     const result = await pool.query(
//       `INSERT INTO galaxies (name, description, is_public, password_hash, category, owner_id)
//        VALUES ($1, $2, $3, $4, $5, $6)
//        RETURNING *`,
//       [name, description, isPublic, passwordHash, category, req.user.id]
//     );

//     const galaxy = result.rows[0];

//     // Add creator as member
//     await pool.query(
//       'INSERT INTO galaxy_members (galaxy_id, user_id) VALUES ($1, $2)',
//       [galaxy.id, req.user.id]
//     );

//     res.status(201).json(galaxy);
//   } catch (error) {
//     console.error('Create galaxy error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Join galaxy
// app.post('/api/galaxies/:id/join', authenticateToken, async (req, res) => {
//   const { id } = req.params;
//   const { password } = req.body;

//   try {
//     // Get galaxy
//     const galaxyResult = await pool.query(
//       'SELECT * FROM galaxies WHERE id = $1',
//       [id]
//     );

//     if (galaxyResult.rows.length === 0) {
//       return res.status(404).json({ error: 'Galaxy not found' });
//     }

//     const galaxy = galaxyResult.rows[0];

//     // Check if already a member
//     const memberCheck = await pool.query(
//       'SELECT * FROM galaxy_members WHERE galaxy_id = $1 AND user_id = $2',
//       [id, req.user.id]
//     );

//     if (memberCheck.rows.length > 0) {
//       return res.status(400).json({ error: 'Already a member' });
//     }

//     // Verify password for private galaxies
//     if (!galaxy.is_public) {
//       if (!password) {
//         return res.status(400).json({ error: 'Password required' });
//       }

//       const validPassword = await bcrypt.compare(password, galaxy.password_hash);
//       if (!validPassword) {
//         return res.status(401).json({ error: 'Invalid password' });
//       }
//     }

//     // Add member
//     await pool.query(
//       'INSERT INTO galaxy_members (galaxy_id, user_id) VALUES ($1, $2)',
//       [id, req.user.id]
//     );

//     res.json({ message: 'Successfully joined galaxy' });
//   } catch (error) {
//     console.error('Join galaxy error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // ============================================
// // PROBLEM ROUTES
// // ============================================

// // Get problems for a galaxy
// app.get('/api/galaxies/:galaxyId/problems', authenticateToken, async (req, res) => {
//   const { galaxyId } = req.params;

//   try {
//     // Check if user is a member
//     const memberCheck = await pool.query(
//       'SELECT * FROM galaxy_members WHERE galaxy_id = $1 AND user_id = $2',
//       [galaxyId, req.user.id]
//     );

//     if (memberCheck.rows.length === 0) {
//       return res.status(403).json({ error: 'Not a member of this galaxy' });
//     }

//     const result = await pool.query(`
//       SELECT 
//         p.*,
//         u.username as creator_name,
//         COUNT(DISTINCT s.id) as solution_count
//       FROM problems p
//       LEFT JOIN users u ON p.creator_id = u.id
//       LEFT JOIN solutions s ON p.id = s.problem_id
//       WHERE p.galaxy_id = $1
//       GROUP BY p.id, u.username
//       ORDER BY p.created_at DESC
//     `, [galaxyId]);

//     res.json(result.rows);
//   } catch (error) {
//     console.error('Get problems error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Create problem (only galaxy owner)
// app.post('/api/galaxies/:galaxyId/problems', authenticateToken, async (req, res) => {
//   const { galaxyId } = req.params;
//   const { title, description } = req.body;

//   try {
//     // Validate input
//     if (!title || !description) {
//       return res.status(400).json({ error: 'Title and description are required' });
//     }

//     // Check if user is the galaxy owner
//     const galaxyResult = await pool.query(
//       'SELECT owner_id FROM galaxies WHERE id = $1',
//       [galaxyId]
//     );

//     if (galaxyResult.rows.length === 0) {
//       return res.status(404).json({ error: 'Galaxy not found' });
//     }

//     if (galaxyResult.rows[0].owner_id !== req.user.id) {
//       return res.status(403).json({ error: 'Only galaxy owner can create problems' });
//     }

//     // Create problem
//     const result = await pool.query(
//       `INSERT INTO problems (galaxy_id, title, description, creator_id, stars)
//        VALUES ($1, $2, $3, $4, 0)
//        RETURNING *`,
//       [galaxyId, title, description, req.user.id]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (error) {
//     console.error('Create problem error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // ============================================
// // SOLUTION ROUTES
// // ============================================

// // Get solutions for a problem
// app.get('/api/problems/:problemId/solutions', authenticateToken, async (req, res) => {
//   const { problemId } = req.params;

//   try {
//     const result = await pool.query(`
//       SELECT 
//         s.*,
//         u.username as author_name,
//         u.rating as author_rating
//       FROM solutions s
//       LEFT JOIN users u ON s.author_id = u.id
//       WHERE s.problem_id = $1
//       ORDER BY s.stars DESC, s.created_at DESC
//     `, [problemId]);

//     res.json(result.rows);
//   } catch (error) {
//     console.error('Get solutions error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Create solution
// app.post('/api/problems/:problemId/solutions', authenticateToken, async (req, res) => {
//   const { problemId } = req.params;
//   const { text } = req.body;

//   try {
//     // Validate input
//     if (!text) {
//       return res.status(400).json({ error: 'Solution text is required' });
//     }

//     // Create solution
//     const result = await pool.query(
//       `INSERT INTO solutions (problem_id, author_id, text, stars)
//        VALUES ($1, $2, $3, 0)
//        RETURNING *`,
//       [problemId, req.user.id, text]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (error) {
//     console.error('Create solution error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Rate solution
// app.post('/api/solutions/:solutionId/rate', authenticateToken, async (req, res) => {
//   const { solutionId } = req.params;
//   const { value } = req.body; // 1 for upvote, -1 for downvote

//   try {
//     // Validate value
//     if (value !== 1 && value !== -1) {
//       return res.status(400).json({ error: 'Rating value must be 1 or -1' });
//     }

//     const client = await pool.connect();

//     try {
//       await client.query('BEGIN');

//       // Check if user already rated this solution
//       const existingRating = await client.query(
//         'SELECT * FROM ratings WHERE solution_id = $1 AND user_id = $2',
//         [solutionId, req.user.id]
//       );

//       let ratingDiff = value;

//       if (existingRating.rows.length > 0) {
//         // Update existing rating
//         const oldValue = existingRating.rows[0].value;
//         ratingDiff = value - oldValue;

//         await client.query(
//           'UPDATE ratings SET value = $1 WHERE solution_id = $2 AND user_id = $3',
//           [value, solutionId, req.user.id]
//         );
//       } else {
//         // Insert new rating
//         await client.query(
//           'INSERT INTO ratings (solution_id, user_id, value) VALUES ($1, $2, $3)',
//           [solutionId, req.user.id, value]
//         );
//       }

//       // Update solution stars
//       await client.query(
//         'UPDATE solutions SET stars = stars + $1 WHERE id = $2',
//         [ratingDiff, solutionId]
//       );

//       // Update author's global rating
//       const solutionResult = await client.query(
//         'SELECT author_id FROM solutions WHERE id = $1',
//         [solutionId]
//       );

//       if (solutionResult.rows.length > 0) {
//         await client.query(
//           'UPDATE users SET rating = rating + $1 WHERE id = $2',
//           [ratingDiff, solutionResult.rows[0].author_id]
//         );
//       }

//       await client.query('COMMIT');

//       res.json({ message: 'Rating recorded successfully' });
//     } catch (error) {
//       await client.query('ROLLBACK');
//       throw error;
//     } finally {
//       client.release();
//     }
//   } catch (error) {
//     console.error('Rate solution error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // ============================================
// // LEADERBOARD ROUTE
// // ============================================

// app.get('/api/leaderboard', async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT 
//         id,
//         username,
//         rating,
//         created_at
//       FROM users
//       ORDER BY rating DESC
//       LIMIT 100
//     `);

//     res.json(result.rows);
//   } catch (error) {
//     console.error('Leaderboard error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // ============================================
// // START SERVER
// // ============================================

// app.listen(PORT, () => {
//   console.log(`🚀 StormBrainer API server running on port ${PORT}`);
//   console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
// });