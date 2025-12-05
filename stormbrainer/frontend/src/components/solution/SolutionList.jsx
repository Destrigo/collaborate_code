// frontend/src/components/solution/SolutionList.jsx

import React, { useState, useEffect } from 'react';
import SolutionCard from './SolutionCard';
import SolutionForm from './SolutionForm';
import Loading from '../common/Loading';
import { getSolutionsForProblem } from '../../services/api';

const SolutionList = ({ problemId }) => {
  const [solutions, setSolutions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch and update the solution list
  const fetchSolutions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSolutionsForProblem(problemId);
      // Solutions are expected to be sorted by stars DESC from the backend
      setSolutions(data); 
    } catch (err) {
      setError('Failed to load solutions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, [problemId]);

  // Handler for when a new solution is posted
  const handleNewSolution = (newSolution) => {
    setSolutions(prevSolutions => [newSolution, ...prevSolutions].sort((a, b) => b.stars - a.stars));
  };
  
  // Handler for when a rating changes (causes re-sort)
  const handleRatingUpdate = () => {
      // A full re-fetch ensures correct data and rating order
      fetchSolutions(); 
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white border-b border-gray-700 pb-2">
        Solutions ({solutions.length})
      </h3>
      
      {/* Form for submitting a new solution */}
      <SolutionForm 
        problemId={problemId} 
        onSolutionSuccess={handleNewSolution} 
      />
      
      {isLoading && <Loading message="Calculating solutions..." />}
      {error && <p className="text-red-400 text-center">{error}</p>}
      
      <div className="space-y-4">
        {!isLoading && solutions.length === 0 && !error && (
          <p className="text-gray-400 text-center">Be the first to offer a solution!</p>
        )}
        
        {solutions.map(solution => (
          <SolutionCard 
            key={solution.id} 
            solution={solution} 
            onRatingChange={handleRatingUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default SolutionList;