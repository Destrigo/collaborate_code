// frontend/src/components/common/ThemeToggle.jsx

import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors focus:outline-none"
      title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <span role="img" aria-label="theme-icon" className="text-xl">
        {darkMode ? '☀️' : '🌙'}
      </span>
    </button>
  );
};

export default ThemeToggle;