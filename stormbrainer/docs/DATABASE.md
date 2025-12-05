# 💾 Database Schema (PostgreSQL)

This schema defines the tables, indexes, and relationships for the StormBrainer application.

## Core Tables and Relationships

The database is built on 6 main tables: 

1.  **`users`**: Stores user authentication and global rating.
    * `rating` (INTEGER, default 0): The user's accumulated score from solution stars.
2.  **`galaxies`**: Stores group properties (public/private, owner, category).
3.  **`galaxy_members`**: Junction table for the M:N relationship between users and galaxies.
4.  **`problems`**: Stores the definition of the intellectual challenge within a galaxy.
5.  **`solutions`**: Stores user-submitted answers to problems.
6.  **`ratings`**: Stores the star votes for solutions, enforcing `UNIQUE(solution_id, user_id)`.

## Essential SQL Commands

```sql
-- Full CREATE TABLE scripts (Place the complete SQL from the previous step here)

-- Example:
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rating INTEGER DEFAULT 0,
    -- ... more fields
);
-- ... all other CREATE TABLE commands ...

-- Views for Statistics:
CREATE VIEW galaxy_stats AS ...
CREATE VIEW user_stats AS ...

-- Triggers for `updated_at`:
CREATE OR REPLACE FUNCTION update_updated_at_column() ...
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users ...