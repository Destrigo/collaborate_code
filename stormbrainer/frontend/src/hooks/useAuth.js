// frontend/src/hooks/useAuth.js

import { useState, useEffect, useContext } from 'react';
import { getCurrentUser, login as apiLogin, register as apiRegister } from '../services/api';
// Assuming AuthContext.jsx is implemented

/**
 * @description Central hook for managing user authentication state.
 */
export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load user from API on mount using stored token
    useEffect(() => {
        const loadUser = async () => {
            if (localStorage.getItem('token')) {
                try {
                    const userData = await getCurrentUser();
                    setUser(userData);
                } catch (err) {
                    // Token is invalid or expired, clear it
                    localStorage.removeItem('token');
                    setUser(null);
                    console.error("Token invalid:", err);
                }
            }
            setIsLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const userData = await apiLogin(email, password);
            setUser(userData);
        } catch (err) {
            setError(err.message || 'Login failed.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (username, email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const userData = await apiRegister(username, email, password);
            setUser(userData);
        } catch (err) {
            setError(err.message || 'Registration failed.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return {
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        // Helper for displaying rating
        globalRating: user?.rating || 0
    };
};