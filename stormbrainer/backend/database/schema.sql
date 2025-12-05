-- StormBrainer Galaxy Edition Database Schema
-- PostgreSQL Database

-- Drop existing tables (use with caution in production)
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS solutions CASCADE;
DROP TABLE IF EXISTS problems CASCADE;
DROP TABLE IF EXISTS galaxy_members CASCADE;
DROP TABLE IF EXISTS galaxies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    rating INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster email lookups
CREATE INDEX idx_users_email ON users(email);

-- Index for leaderboard queries
CREATE INDEX idx_users_rating ON users(rating DESC);

-- ============================================
-- GALAXIES TABLE
-- ============================================
CREATE TABLE galaxies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT true,
    password_hash VARCHAR(255),
    category VARCHAR(50) NOT NULL DEFAULT 'General',
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for filtering public galaxies
CREATE INDEX idx_galaxies_public ON galaxies(is_public);

-- Index for category filtering
CREATE INDEX idx_galaxies_category ON galaxies(category);

-- Index for owner queries
CREATE INDEX idx_galaxies_owner ON galaxies(owner_id);

-- ============================================
-- GALAXY MEMBERS (Junction Table)
-- ============================================
CREATE TABLE galaxy_members (
    galaxy_id INTEGER NOT NULL REFERENCES galaxies(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (galaxy_id, user_id)
);

-- Index for user's galaxies lookup
CREATE INDEX idx_galaxy_members_user ON galaxy_members(user_id);

-- Index for galaxy members lookup
CREATE INDEX idx_galaxy_members_galaxy ON galaxy_members(galaxy_id);

-- ============================================
-- PROBLEMS TABLE
-- ============================================
CREATE TABLE problems (
    id SERIAL PRIMARY KEY,
    galaxy_id INTEGER NOT NULL REFERENCES galaxies(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    creator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stars INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for galaxy's problems lookup
CREATE INDEX idx_problems_galaxy ON problems(galaxy_id);

-- Index for creator's problems
CREATE INDEX idx_problems_creator ON problems(creator_id);

-- Index for sorting by stars
CREATE INDEX idx_problems_stars ON problems(stars DESC);

-- ============================================
-- SOLUTIONS TABLE
-- ============================================
CREATE TABLE solutions (
    id SERIAL PRIMARY KEY,
    problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    stars INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for problem's solutions lookup
CREATE INDEX idx_solutions_problem ON solutions(problem_id);

-- Index for author's solutions
CREATE INDEX idx_solutions_author ON solutions(author_id);

-- Index for sorting by stars
CREATE INDEX idx_solutions_stars ON solutions(stars DESC);

-- ============================================
-- RATINGS TABLE (Prevent duplicate ratings)
-- ============================================
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    solution_id INTEGER NOT NULL REFERENCES solutions(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    value INTEGER NOT NULL CHECK (value IN (-1, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(solution_id, user_id)
);

-- Index for user's ratings
CREATE INDEX idx_ratings_user ON ratings(user_id);

-- Index for solution's ratings
CREATE INDEX idx_ratings_solution ON ratings(solution_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_galaxies_updated_at BEFORE UPDATE ON galaxies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_problems_updated_at BEFORE UPDATE ON problems
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_solutions_updated_at BEFORE UPDATE ON solutions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View for galaxy statistics
CREATE VIEW galaxy_stats AS
SELECT 
    g.id,
    g.name,
    g.category,
    g.is_public,
    COUNT(DISTINCT gm.user_id) as member_count,
    COUNT(DISTINCT p.id) as problem_count,
    COUNT(DISTINCT s.id) as solution_count
FROM galaxies g
LEFT JOIN galaxy_members gm ON g.id = gm.galaxy_id
LEFT JOIN problems p ON g.id = p.galaxy_id
LEFT JOIN solutions s ON p.id = s.problem_id
GROUP BY g.id, g.name, g.category, g.is_public;

-- View for user statistics
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.username,
    u.rating,
    COUNT(DISTINCT s.id) as total_solutions,
    COUNT(DISTINCT p.id) as total_problems_created,
    COUNT(DISTINCT gm.galaxy_id) as galaxies_joined
FROM users u
LEFT JOIN solutions s ON u.id = s.author_id
LEFT JOIN problems p ON u.id = p.creator_id
LEFT JOIN galaxy_members gm ON u.id = gm.user_id
GROUP BY u.id, u.username, u.rating;

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Insert test users (password is 'password123' hashed with bcrypt)
-- Note: Replace with actual bcrypt hashes in production
INSERT INTO users (email, username, password_hash, rating) VALUES
('alice@example.com', 'Alice', '$2b$10$YourBcryptHashHere', 150),
('bob@example.com', 'Bob', '$2b$10$YourBcryptHashHere', 200),
('charlie@example.com', 'Charlie', '$2b$10$YourBcryptHashHere', 75);

-- Insert test galaxies
INSERT INTO galaxies (name, description, is_public, category, owner_id) VALUES
('Math Wizards', 'Challenge your mathematical skills', true, 'Math', 1),
('Code Masters', 'Programming challenges for all levels', true, 'Programming', 2),
('Logic Puzzles', 'Mind-bending logic problems', true, 'Logic', 3);

-- Insert galaxy members
INSERT INTO galaxy_members (galaxy_id, user_id) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 2),
(3, 2), (3, 3);

-- Insert test problems
INSERT INTO problems (galaxy_id, title, description, creator_id, stars) VALUES
(1, 'Fibonacci Sequence', 'Calculate the 100th Fibonacci number efficiently', 1, 25),
(2, 'Binary Search Tree', 'Implement a balanced BST with insert, delete, and search', 2, 30),
(3, 'The Monty Hall Problem', 'Explain why switching doors increases your odds', 3, 15);

-- Insert test solutions
INSERT INTO solutions (problem_id, author_id, text, stars) VALUES
(1, 2, 'Use dynamic programming with memoization to avoid recalculation', 10),
(1, 3, 'Matrix exponentiation provides O(log n) time complexity', 15),
(2, 1, 'Implement AVL tree with rotation operations for balance', 12),
(3, 1, 'The key is that the host knows and always opens a goat door', 8);

-- Insert test ratings
INSERT INTO ratings (solution_id, user_id, value) VALUES
(1, 1, 1), (1, 3, 1),
(2, 1, 1), (2, 2, 1),
(3, 2, 1), (3, 3, 1);

-- ============================================
-- USEFUL QUERIES
-- ============================================

-- Get all public galaxies with stats
-- SELECT * FROM galaxy_stats WHERE is_public = true ORDER BY member_count DESC;

-- Get top users by rating
-- SELECT * FROM user_stats ORDER BY rating DESC LIMIT 10;

-- Get all problems in a galaxy with solution counts
-- SELECT p.*, COUNT(s.id) as solution_count 
-- FROM problems p 
-- LEFT JOIN solutions s ON p.id = s.problem_id 
-- WHERE p.galaxy_id = 1 
-- GROUP BY p.id;

-- Get user's total rating from all solutions
-- SELECT u.username, SUM(s.stars) as total_solution_stars
-- FROM users u
-- LEFT JOIN solutions s ON u.id = s.author_id
-- GROUP BY u.id, u.username
-- ORDER BY total_solution_stars DESC;