// StormBrainer API Service
const API_BASE_URL = 'https://stormbrainer-galaxy.onrender.com/api';

/**
 * Helper function to create fetch requests with JWT authentication.
 */
const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: defaultHeaders,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
};

// --- Authentication ---

export const login = async (email, password) => {
    const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    if (response.token) {
        localStorage.setItem('token', response.token);
    }
    return response; // { user, token }
};

export const register = async (username, email, password) => {
    const response = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
    });
    if (response.token) {
        localStorage.setItem('token', response.token);
    }
    return response; // { user, token }
};

export const getCurrentUser = async () => {
    return apiFetch('/auth/me');
};

// --- Galaxies ---

export const getGalaxies = async (filter = 'public') => {
    return apiFetch(`/galaxies?filter=${filter}`);
};

export const createGalaxy = async ({ name, description, category, is_public, password }) => {
    return apiFetch('/galaxies', {
        method: 'POST',
        body: JSON.stringify({ name, description, category, is_public, password }),
    });
};

export const joinGalaxy = async (galaxyId, password = null) => {
    return apiFetch(`/galaxies/${galaxyId}/join`, {
        method: 'POST',
        body: JSON.stringify({ password }),
    });
};

// --- Problems ---

export const getProblems = (galaxyId) => {
    return apiFetch(`/galaxies/${galaxyId}/problems`);
};

export const createProblem = (galaxyId, title, description) => {
    return apiFetch(`/galaxies/${galaxyId}/problems`, {
        method: 'POST',
        body: JSON.stringify({ title, description }),
    });
};

// --- Solutions ---

export const getSolutions = (problemId) => {
    return apiFetch(`/problems/${problemId}/solutions`);
};

export const createSolution = (problemId, text) => {
    return apiFetch(`/problems/${problemId}/solutions`, {
        method: 'POST',
        body: JSON.stringify({ text }),
    });
};

export const rateSolution = (solutionId, value) => {
    return apiFetch(`/solutions/${solutionId}/rate`, {
        method: 'POST',
        body: JSON.stringify({ value }),
    });
};

// --- Leaderboard ---

export const getLeaderboardData = () => {
    return apiFetch('/leaderboard');
};

// --- Categories (mock) ---

export const getCategories = () => {
    return ['Math', 'Logic', 'Programming', 'Riddles', 'General'];
};

// ============================================
// USER STATS API (ADD THESE)
// ============================================

// Get user statistics
export const getUserStats = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/${userId}/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user stats');
        }

        return await response.json();
    } catch (error) {
        console.error('Get user stats error:', error);
        throw error;
    }
};

// Update user profile
export const updateUserProfile = async (userId, updates) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(updates),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update profile');
        }

        return await response.json();
    } catch (error) {
        console.error('Update profile error:', error);
        throw error;
    }
};

// Get user achievements
export const getUserAchievements = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/${userId}/achievements`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch achievements');
        }

        return await response.json();
    } catch (error) {
        console.error('Get achievements error:', error);
        throw error;
    }
};