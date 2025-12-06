// frontend/src/components/auth/LoginForm.jsx

import React, { useState } from 'react';
import { login, register } from '../../services/api';

/**
 * @description Auth component that handles both login and registration.
 */
const AuthComponent = ({ onLogin }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            let response;
            if (isLoginMode) {
                response = await login(username, password);
            } else {
                response = await register(username, email, password);
            }
            // Pass user data to parent
            onLogin(response.user);
        } catch (err) {
            setError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <div className="w-full max-w-sm p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-2xl backdrop-blur-md">
                <h3 className="text-3xl font-bold mb-6 text-center text-indigo-400">
                    {isLoginMode ? 'Log In' : 'Register'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Please wait...' : (isLoginMode ? 'Explore Galaxy' : 'Create Account')}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {isLoginMode ? "New to StormBrainer? " : "Already have an account? "}
                    <button
                        onClick={() => {
                            setIsLoginMode(!isLoginMode);
                            setError('');
                        }}
                        className="text-pink-500 hover:underline font-medium"
                    >
                        {isLoginMode ? 'Register' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthComponent;
