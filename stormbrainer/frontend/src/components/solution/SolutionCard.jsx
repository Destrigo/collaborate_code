// frontend/src/components/solution/SolutionCard.jsx

import React, { useState } from 'react';
import { rateSolution } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const SolutionCard = ({ solution, onRatingChange }) => {
  const { user, updateRating } = useAuth();
  const [stars, setStars] = useState(solution.stars);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if the current user is the author
  const isAuthor = user.id === solution.author_id;

  const handleRate = async (value) => {
    if (isAuthor || isSubmitting) return; // Prevent rating own solution or double-submitting

    setIsSubmitting(true);
    try {
      // API call to rate the solution (value: 1 or -1)
      await rateSolution(solution.id, value);
      
      // Optimistically update UI
      const newStars = stars + value;
      setStars(newStars);
      
      // Update global user rating display immediately via Auth context
      updateRating(user.rating + value); 
      
      // Notify parent component to refresh/re-sort solutions
      onRatingChange(); 
      
    } catch (error) {
      // Revert or show error message
      console.error("Rating failed:", error);
      alert(error.response?.data?.error || "Failed to submit rating.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`p-5 rounded-xl shadow-lg transition-all border ${isAuthor ? 'bg-purple-900/30 border-purple-600' : 'bg-gray-800 border-gray-700 hover:bg-gray-700/80'}`}>
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm text-gray-400">
          Author: <span className="font-semibold text-white">{solution.author_name}</span> 
          <span className="ml-2 text-yellow-500">({solution.author_rating} ⭐)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-yellow-400">{stars}</span>
          <span className="text-xl text-yellow-400">⭐</span>
        </div>
      </div>
      
      <p className="text-gray-100 whitespace-pre-wrap mb-4">{solution.text}</p>
      
      <div className="flex justify-end space-x-2">
        {!isAuthor && (
          <>
            <button
              onClick={() => handleRate(1)}
              disabled={isSubmitting}
              className="p-2 rounded-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 transition-colors"
              title="Give a Star"
            >
              ⬆️
            </button>
            <button
              onClick={() => handleRate(-1)}
              disabled={isSubmitting}
              className="p-2 rounded-full bg-red-600 hover:bg-red-700 disabled:bg-gray-500 transition-colors"
              title="Remove a Star"
            >
              ⬇️
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SolutionCard;