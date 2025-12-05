import axios from 'axios';

// StormBrainer API - Deployed on Render
const API_BASE_URL = 'https://stormbrainer-galaxy.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Utility to handle API responses and errors.
 * Note: The App.jsx handles setting the Authorization header directly on axios.defaults.
 */

// --- Authentication ---

export const login = async (username, password) => {
    // Attempt to log in the user
    const response = await api.post('/auth/login', { username, password });
    return response.data; // Expected: { user, token }
};

export const register = async (username, password) => {
    // Attempt to register a new user
    const response = await api.post('/auth/register', { username, password });
    return response.data; // Expected: { user, token }
};
// // --- AUTH API CALLS ---

// export const register = async (username, email, password) => {
//     const data = await apiFetch('/auth/register', {
//         method: 'POST',
//         body: JSON.stringify({ username, email, password }),
//     });
//     // On success, save the token and return user data
//     localStorage.setItem('token', data.token);
//     return data.user;
// };

// export const login = async (email, password) => {
//     const data = await apiFetch('/auth/login', {
//         method: 'POST',
//         body: JSON.stringify({ email, password }),
//     });
//     // On success, save the token and return user data
//     localStorage.setItem('token', data.token);
//     return data.user;
// };

export const getCurrentUser = async () => {
    // Requires a token to be present in localStorage for the apiFetch to work
    return apiFetch('/auth/me');
};

// --- Data Fetching ---

export const getGalaxies = async () => {
    // Fetch a list of all galaxies
    const response = await api.get('/galaxies');
    return response.data;
};

export const getProblemsForGalaxy = async (galaxyId) => {
    // Fetch problems belonging to a specific galaxy
    const response = await api.get(`/galaxies/${galaxyId}/problems`);
    return response.data;
};

export const getSolutionsForProblem = async (problemId) => {
    // Fetch solutions for a specific problem, sorted by stars/rating
    const response = await api.get(`/problems/${problemId}/solutions`);
    return response.data;
};

// --- Solution Submission & Rating ---

export const createSolution = async (problemId, text) => {
    // Submit a new solution for a problem
    // Requires authentication token in headers
    const response = await api.post(`/problems/${problemId}/solutions`, { text });
    return response.data;
};

export const rateSolution = async (solutionId, value) => {
    // Rate a solution (1 for upvote, -1 for downvote)
    // Requires authentication token in headers
    const response = await api.post(`/solutions/${solutionId}/rate`, { value });
    return response.data;
};

// --- LEADERBOARD API CALLS ---

export const getLeaderboardData = () => {
    // Note: The /leaderboard endpoint is public, so we use apiFetch but authentication is optional
    return apiFetch('/leaderboard', {
        method: 'GET',
        // Specifically remove token if the route is public and the client doesn't want it sent
        headers: { 'Authorization': undefined } 
    });
};

export const getCategories = () => {
    // Mock categories for the frontend filter, since the backend doesn't have a dedicated categories table/endpoint yet
    return ['Math', 'Logic', 'Programming', 'Riddles', 'General'];
};


// // frontend/src/services/api.js

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// /**
//  * @description Helper function to create a fetch request with JWT authentication.
//  */
const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    // Default headers
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    // Add Authorization header if token exists
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: defaultHeaders,
    });

    // Handle generic HTTP errors
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return null;
    }

    return response.json();
};

// // --- GALAXY API CALLS ---

// export const getGalaxies = (filter = 'public') => {
//     return apiFetch(`/galaxies?filter=${filter}`, {
//         method: 'GET',
//     });
// };

export const createGalaxy = async ({ name, description, category, is_public, password }) => {
    return apiFetch('/galaxies', {
        method: 'POST',
        body: JSON.stringify({ name, description, category, is_public, password }),
    });
};

export const joinGalaxy = async (galaxyId, password = null) => {
    // Note: The backend handles whether a password is required based on the galaxy type
    return apiFetch(`/galaxies/${galaxyId}/join`, {
        method: 'POST',
        body: JSON.stringify({ password }),
    });
};

// // --- PROBLEM API CALLS ---

export const getProblems = (galaxyId) => {
    return apiFetch(`/galaxies/${galaxyId}/problems`, {
        method: 'GET',
    });
};

export const createProblem = (galaxyId, title, description) => {
    return apiFetch(`/galaxies/${galaxyId}/problems`, {
        method: 'POST',
        body: JSON.stringify({ title, description }),
    });
};

// // --- SOLUTION API CALLS ---

export const getSolutions = (problemId) => {
    return apiFetch(`/problems/${problemId}/solutions`, {
        method: 'GET',
    });
};

// export const createSolution = (problemId, text) => {
//     return apiFetch(`/problems/${problemId}/solutions`, {
//         method: 'POST',
//         body: JSON.stringify({ text }),
//     });
// };

// export const rateSolution = (solutionId, value) => {
//     return apiFetch(`/solutions/${solutionId}/rate`, {
//         method: 'POST',
//         body: JSON.stringify({ value }), // Value is 1 for a star
//     });
// };

// Export the instance for general use
export default api;