import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In a React Native/Expo app, the API base URL must be the IP of your computer 
// if running on a physical device, or 'localhost' if using an emulator.
// Since this is a self-contained environment, we will use the local server address.
const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Automatically attach the JWT token if available
api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// --- Auth Endpoints ---

export const registerUser = async (email, password, username) => {
    const response = await api.post('/auth/register', { email, password, username });
    await AsyncStorage.setItem('token', response.data.token);
    return response.data;
};

export const loginUser = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('token', response.data.token);
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    return response.data.user;
};

// --- Galaxy Endpoints ---

export const getGalaxies = async () => {
    const response = await api.get('/galaxies');
    return response.data.galaxies;
};

export const getGalaxyDetails = async (galaxyId) => {
    const response = await api.get(`/galaxies/${galaxyId}`);
    return response.data.galaxy;
};

export const joinGalaxy = async (galaxyId, password) => {
    const response = await api.post(`/galaxies/${galaxyId}/join`, { password });
    return response.data;
};

// --- Problem & Solution Endpoints ---

export const getProblemsForGalaxy = async (galaxyId) => {
    const response = await api.get(`/galaxies/${galaxyId}/problems`);
    return response.data.problems;
};

export const getSolutionsForProblem = async (problemId) => {
    const response = await api.get(`/problems/${problemId}/solutions`);
    return response.data.solutions;
};

export const createSolution = async (problemId, text) => {
    const response = await api.post(`/problems/${problemId}/solutions`, { text });
    return response.data.solution;
};

export const rateSolution = async (solutionId, value) => {
    const response = await api.post(`/solutions/${solutionId}/rate`, { value });
    return response.data;
};