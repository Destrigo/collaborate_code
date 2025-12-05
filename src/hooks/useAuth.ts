import { useState, useEffect } from 'react';
import { getCurrentUser, login as apiLogin, register as apiRegister, User } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.getItem('token')) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
          console.error("Token invalid:", err);
        }
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: userData } = await apiLogin(username, password);
      setUser(userData);
      return userData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: userData } = await apiRegister(username, password);
      setUser(userData);
      return userData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed.';
      setError(message);
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
