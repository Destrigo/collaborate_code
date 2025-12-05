// frontend/src/components/problem/CreateProblemModal.jsx

import React, { useState } from 'react';
import Modal from '../common/Modal'; 
import { createProblem } from '../../services/api';

const CreateProblemModal = ({ isOpen, onClose, galaxyId, onCreateSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const newProblem = await createProblem(galaxyId, title, description);
      onCreateSuccess(newProblem);
      setTitle('');
      setDescription('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create problem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post a New Problem Planet">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Problem Title (e.g., The Traveling Salesman)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
        />
        <textarea
          placeholder="Detailed problem description and requirements..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="6"
          required
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 resize-none"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-500"
        >
          {loading ? 'Submitting...' : 'Create Problem'}
        </button>
      </form>
    </Modal>
  );
};

export default CreateProblemModal;