// frontend/src/components/auth/RegisterForm.jsx

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password, username);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-96 p-8 bg-gray-800 rounded-xl shadow-2xl space-y-6">
      <h2 className="text-3xl font-bold text-center text-purple-400">Register New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
        />
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-500"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <button
        onClick={onSwitchToLogin}
        className="w-full text-sm text-gray-400 hover:text-purple-300 transition-colors"
      >
        Already have an account? Login here.
      </button>
    </div>
  );
};

export default RegisterForm;