import React, { useState, useEffect, createContext, useContext } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser, loginUser, registerUser } from './src/services/api';
import AppNavigator from './src/navigation/AppNavigator';

// --- Auth Context (Simplified for Mobile) ---
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // If token exists, try to fetch user data
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    const userData = await getCurrentUser();
                    setUser(userData);
                }
            } catch (error) {
                // Token invalid or network error
                await AsyncStorage.removeItem('token');
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const data = await loginUser(email, password);
        setUser(data.user);
    };

    const register = async (email, password, username) => {
        const data = await registerUser(email, password, username);
        setUser(data.user);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        setUser(null);
    };

    // Update user rating locally
    const updateRating = (newRating) => {
        if (user) {
            setUser(prev => ({ ...prev, rating: newRating }));
        }
    }

    const value = { user, isLoading, login, register, logout, updateRating };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
                <ActivityIndicator size="large" color="#a78bfa" />
            </View>
        );
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- Main App Component ---
export default function App() {
    return (
        <AuthProvider>
            <AppNavigator />
        </AuthProvider>
    );
}