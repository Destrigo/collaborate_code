// frontend/src/components/galaxy/GalaxyCard.jsx

import React from 'react';

const GalaxyCard = ({ galaxy, onJoin, onEnter }) => {
  return (
    <div className="p-6 bg-white/5 dark:bg-gray-800/70 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-600/30">
      <h4 className="text-2xl font-semibold text-purple-400 truncate">{galaxy.name}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        Owner: **{galaxy.owner_username}** | Category: **{galaxy.category}**
      </p>
      <p className="text-gray-700 dark:text-gray-300 line-clamp-2 mb-4">{galaxy.description || 'No description provided.'}</p>
      
      <div className="flex justify-between items-center mt-4">
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${galaxy.is_public ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
          {galaxy.is_public ? 'Public' : 'Private'}
        </span>
        
        {/* Action Button based on membership */}
        {galaxy.is_member ? (
          <button 
            onClick={() => onEnter(galaxy)}
            className="px-4 py-2 text-sm font-medium text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Enter Galaxy 🚀
          </button>
        ) : (
          <button 
            onClick={() => onJoin(galaxy)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Join
          </button>
        )}
      </div>
    </div>
  );
};

export default GalaxyCard;