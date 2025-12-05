// frontend/src/components/problem/PlanetProblem.jsx

import React from 'react';

const PlanetProblem = ({ problem, onSelect }) => {
  // Determine planet size based on stars/solutions for visual effect
  const sizeClass = problem.solution_count < 5 ? 'w-16 h-16' : 
                    problem.solution_count < 15 ? 'w-24 h-24' : 'w-32 h-32';
  
  return (
    <div 
      className={`relative cursor-pointer transition-transform duration-300 hover:scale-110 flex flex-col items-center justify-center m-4`}
      onClick={() => onSelect(problem)}
    >
      <div 
        className={`${sizeClass} rounded-full bg-blue-500 shadow-xl border-4 border-white/50 animate-pulse`} 
        style={{ 
          backgroundImage: `radial-gradient(circle at 30% 30%, #4f46e5, #1e40af 70%)` 
        }}
      >
        <span className="absolute top-0 right-0 p-1 text-xs font-bold bg-yellow-400 text-gray-900 rounded-full shadow-md transform translate-x-1/2 -translate-y-1/2">
          {problem.solution_count} Sol.
        </span>
      </div>
      <p className="text-sm mt-2 text-center text-white/90 font-medium max-w-[100px] truncate">{problem.title}</p>
      <p className="text-xs text-gray-400">Stars: {problem.stars}</p>
    </div>
  );
};

export default PlanetProblem;