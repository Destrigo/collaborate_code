// backend/middleware/errorHandler.js

/**
 * Global Error Handler Middleware
 * Must have 4 arguments (err, req, res, next) to be recognized by Express
 */
const errorHandler = (err, req, res, next) => {
    // Log the error stack for server-side debugging
    console.error(err.stack);

    // Default status code and message
    let statusCode = err.statusCode || 500;
    let message = err.message || 'An unexpected server error occurred.';

    // Handle specific types of errors if necessary (e.g., database unique constraints)
    // Example for PostgreSQL duplicate key error (P2002 equivalent)
    if (err.code === '23505') {
        statusCode = 400;
        message = 'A resource with that unique identifier (e.g., email or username) already exists.';
    }

    // Send the standardized error response
    res.status(statusCode).json({
        success: false,
        error: message,
    });
};

module.exports = errorHandler;