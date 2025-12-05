// frontend/src/components/problem/ProblemList.jsx

import React from 'react';
import Loading from '../common/Loading';
import PlanetProblem from './PlanetProblem';

const ProblemList = ({ problems, isLoading, onSelectProblem }) => {
  if (isLoading) {
    return <Loading message="Warping in problems..." />;
  }

  if (!problems || problems.length === 0) {
    return (
      <div className="text-center p-10 text-gray-500">
        <p className="text-xl">No problems have been charted in this galaxy yet.</p>
        <p className="text-sm">Be the first to create a problem!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center p-4">
      {problems.map(problem => (
        <PlanetProblem 
          key={problem.id} 
          problem={problem} 
          onSelect={onSelectProblem} 
        />
      ))}
    </div>
  );
};

export default ProblemList;