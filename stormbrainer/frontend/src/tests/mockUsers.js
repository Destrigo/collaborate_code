/**
 * Mock User Data for StormBrainer Galaxy Edition
 * Includes fields for authentication, user profiles, and game rating system.
 */

export const MOCK_USERS = [ // Changed to NAMED export
    {
        id: 'usr-1a4b',
        username: 'StellarExplorer',
        email: 'stellar@galaxy.com',
        // In a real app, this would be a hashed password, but for mock login:
        password: 'password123', 
        rating: 1850, // High-rated coder
        avatar: '🌠',
        role: 'admin',
        last_login: new Date('2025-11-20T10:00:00Z').toISOString(),
    },
    {
        id: 'usr-2c6d',
        username: 'CosmicCoder',
        email: 'cosmic@galaxy.com',
        password: 'password123',
        rating: 1520, // Average coder
        avatar: '🛰️',
        role: 'user',
        last_login: new Date('2025-12-01T15:30:00Z').toISOString(),
    },
    {
        id: 'usr-3e8f',
        username: 'NebulaNomad',
        email: 'nebula@galaxy.com',
        password: 'password123',
        rating: 1100, // Beginner coder
        avatar: '🌌',
        role: 'user',
        last_login: new Date('2025-11-28T08:15:00Z').toISOString(),
    },
    {
        id: 'usr-4g0h',
        username: 'QuantumQuill',
        email: 'quantum@galaxy.com',
        password: 'password123',
        rating: 2200, // Top-tier expert
        avatar: '⚛️',
        role: 'user',
        last_login: new Date('2025-12-05T19:00:00Z').toISOString(),
    },
    {
        id: 'usr-5i2j',
        username: 'BinaryBoss',
        email: 'binary@galaxy.com',
        password: 'password123',
        rating: 1380, // Slightly below average
        avatar: '🤖',
        role: 'user',
        last_login: new Date('2025-11-15T22:45:00Z').toISOString(),
    },
];

export default MOCK_USERS;