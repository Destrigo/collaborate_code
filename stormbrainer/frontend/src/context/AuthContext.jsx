// frontend/src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getCurrentUser, loginUser, registerUser } from '../services/api'; // Assuming you implement these in api.js

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Initial Auth Check ---
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  // --- Auth Actions ---
  const login = async (email, password) => {
    const { user: userData, token } = await loginUser(email, password);
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const register = async (username, email, password) => {
    const { user: userData, token } = await registerUser(username, email, password);
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };
  
  // Update user data (e.g., after rating change)
  const updateRating = (newRating) => {
    if (user) {
        setUser(prev => ({ ...prev, rating: newRating }));
    }
  }

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateRating
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};