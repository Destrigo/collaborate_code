// frontend/src/components/auth/LoginForm.jsx

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

/**
 * @description User login form component.
 */
const LoginForm = ({ switchToRegister, onAuthSuccess }) => {
    const { login, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            // On successful login, trigger the parent's success handler
            onAuthSuccess(); 
        } catch (err) {
            setError(err.message || 'Login failed. Check your credentials.');
        }
    };

    return (
        <div className="w-full max-w-sm p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-2xl backdrop-blur-md">
            <h3 className="text-3xl font-bold mb-6 text-center text-indigo-400">
                Log In
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                />
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                    {isLoading ? 'Authenticating...' : 'Explore Galaxy'}
                </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                New to StormBrainer?{' '}
                <button
                    onClick={switchToRegister}
                    className="text-pink-500 hover:underline font-medium"
                >
                    Register
                </button>
            </p>
        </div>
    );
};

export default LoginForm;