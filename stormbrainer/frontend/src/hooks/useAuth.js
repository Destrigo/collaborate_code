// frontend/src/hooks/useAuth.js

import { useState, useEffect } from 'react';
import { getCurrentUser, login as apiLogin, register as apiRegister } from '../services/api';

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

    const login = async (username, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const { user: userData } = await apiLogin(username, password);
            setUser(userData);
            return userData;
        } catch (err) {
            setError(err.message || 'Login failed.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (username, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const { user: userData } = await apiRegister(username, password);
            setUser(userData);
            return userData;
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
        setUser,
        isLoading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        globalRating: user?.rating || 0
    };
};
