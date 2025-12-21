import { useState, useEffect } from 'react';
import { getCurrentUser, login as apiLogin, register as apiRegister, User } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token || token === "null" || token === "undefined") {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: userData, token } = await apiLogin(email, password);
      localStorage.setItem("token", token);
      setUser(userData);
      return userData;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: userData, token } = await apiRegister(email, password, username);
      localStorage.setItem("token", token);
      setUser(userData);
      return userData;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const token = localStorage.getItem("token");
  const isAuthenticated =
    token !== null &&
    token !== "null" &&
    token !== "undefined";

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    globalRating: user?.rating || 0
  };
};
