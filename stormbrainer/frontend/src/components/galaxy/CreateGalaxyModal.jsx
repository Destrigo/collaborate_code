// frontend/src/components/galaxy/CreateGalaxyModal.jsx

import React, { useState } from 'react';
import Modal from '../common/Modal'; // Assuming a generic Modal component exists
import { getCategories } from '../../services/api'; 

const CreateGalaxyModal = ({ isOpen, onClose, onCreateSuccess }) => {
  const categories = getCategories(); // Fetch mock categories
  const [data, setData] = useState({ 
    name: '', 
    description: '', 
    category: categories[0] || '', // Default to first category
    is_public: true, 
    password: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newGalaxy = await onCreateSuccess(data);
      // Reset form and close modal
      setData({ name: '', description: '', category: categories[0] || '', is_public: true, password: '' });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Launch a New Galaxy 🪐">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Galaxy Name (e.g., 'Relativity Riddles')"
          value={data.name}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
        />
        <textarea
          name="description"
          placeholder="Galaxy description..."
          value={data.description}
          onChange={handleChange}
          rows="3"
          className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
        ></textarea>
        <select
          name="category"
          value={data.category}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_public"
              checked={data.is_public}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-purple-600"
            />
            <span className="text-gray-700 dark:text-gray-300">Public Galaxy</span>
          </label>
          
          {!data.is_public && (
            <input
              type="password"
              name="password"
              placeholder="Private Access Code"
              value={data.password}
              onChange={handleChange}
              required
              className="flex-grow p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
            />
          )}
        </div>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Initiating Launch...' : 'Launch Galaxy'}
        </button>
      </form>
    </Modal>
  );
};

export default CreateGalaxyModal;