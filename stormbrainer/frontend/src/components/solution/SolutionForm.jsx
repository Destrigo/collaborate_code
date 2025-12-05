// frontend/src/components/solution/SolutionForm.jsx

import React, { useState } from 'react';
import { createSolution } from '../../services/api';

const SolutionForm = ({ problemId, onSolutionSuccess }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (text.trim().length < 50) {
      return setError('Solution must be at least 50 characters long.');
    }
    
    setLoading(true);
    
    try {
      const newSolution = await createSolution(problemId, text);
      onSolutionSuccess(newSolution);
      setText(''); // Clear form on success
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post solution.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/80 p-5 rounded-xl border border-gray-700">
      <h4 className="text-xl font-semibold mb-3 text-green-400">Submit Your Solution</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          placeholder="Type your detailed solution here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="5"
          required
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 resize-none focus:ring-green-500 focus:border-green-500"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-500"
        >
          {loading ? 'Transmitting...' : 'Post Solution'}
        </button>
      </form>
    </div>
  );
};

export default SolutionForm;