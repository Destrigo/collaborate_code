// frontend/src/components/problem/ProblemCard.jsx

import React from 'react';

const ProblemCard = ({ problem, onBackToPlanets }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-xl border-t-4 border-blue-500 mb-8">
      <div className="flex justify-between items-start">
        <h2 className="text-3xl font-bold text-blue-400 mb-2">{problem.title}</h2>
        <button
          onClick={onBackToPlanets}
          className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors text-sm"
        >
          ← Back to Galaxy Planets
        </button>
      </div>
      <p className="text-sm text-gray-400 mb-4">
        Posted by **{problem.creator_name}** | {problem.solution_count} Solutions
      </p>
      
      <div className="bg-gray-700 p-4 rounded-lg">
        <p className="text-gray-200 whitespace-pre-wrap">{problem.description}</p>
      </div>

      <div className="mt-4 flex items-center justify-end">
        <span className="text-xl font-bold text-yellow-400">
          {problem.stars} ⭐
        </span>
      </div>
    </div>
  );
};

export default ProblemCard;