// frontend/src/components/common/Header.jsx

import React from 'react';
import { useAuth } from '../../hooks/useAuth'; // Assuming useAuth is created in earlier steps
import { Link } from 'react-router-dom'; // Assuming react-router-dom is used

const Header = () => {
  const { user, logout } = useAuth();
  
  if (!user) return null; // Hide header if not logged in (forms handle state)

  return (
    <header className="flex justify-between items-center p-4 bg-gray-900 shadow-lg border-b border-purple-800/50">
      <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
        StormBrainer 🌌
      </div>

      <nav className="flex items-center space-x-6">
        {/* User Info and Rating */}
        <div className="flex items-center space-x-2 text-white bg-purple-900/50 p-2 rounded-full px-4">
          <span className="font-semibold text-lg">{user.username}</span>
          <span className="text-yellow-400 font-bold">
            ({user.rating} ⭐)
          </span>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;