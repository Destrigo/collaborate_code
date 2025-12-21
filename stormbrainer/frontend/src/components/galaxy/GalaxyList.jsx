import React, { useState } from 'react';
import { Grid, List, Lock, Unlock, X, CheckCircle, Trash2, Eye, EyeOff, Plus } from 'lucide-react';

const EnhancedGalaxyList = ({ user, onEnterGalaxy }) => {
  const [galaxies, setGalaxies] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('public');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [joinPassword, setJoinPassword] = useState('');
  const [joiningGalaxy, setJoiningGalaxy] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const categories = ['All', 'Math', 'Logic', 'Programming', 'Riddles', 'General'];

  const GALAXY_STATUS = {
    OPEN: 'open',
    CLOSED: 'closed',
    PRIVATE: 'private',
    DELETED: 'deleted'
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case GALAXY_STATUS.OPEN:
        return { icon: <Unlock size={14} />, text: 'Open', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
      case GALAXY_STATUS.CLOSED:
        return { icon: <Lock size={14} />, text: 'Closed', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
      case GALAXY_STATUS.PRIVATE:
        return { icon: <Eye size={14} />, text: 'Private', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
      case GALAXY_STATUS.DELETED:
        return { icon: <Trash2 size={14} />, text: 'Deleted', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
      default:
        return { icon: <Unlock size={14} />, text: 'Open', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    }
  };

  const canJoinGalaxy = (galaxy) => {
    if (galaxy.status === GALAXY_STATUS.DELETED) return false;
    if (galaxy.is_member) return true;
    return true;
  };

  const canInteractWithGalaxy = (galaxy) => {
    if (galaxy.status === GALAXY_STATUS.DELETED) return false;
    if (galaxy.status === GALAXY_STATUS.CLOSED) return false;
    if (!galaxy.is_member) return false;
    return true;
  };

  const handleJoinClick = (galaxy) => {
    if (galaxy.status === GALAXY_STATUS.PRIVATE && !galaxy.is_member) {
      setJoiningGalaxy(galaxy);
    } else if (galaxy.is_member) {
      onEnterGalaxy(galaxy);
    } else {
      joinGalaxy(galaxy.id);
    }
  };

  const joinGalaxy = async (galaxyId, password = null) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://stormbrainer-galaxy.onrender.com/api/galaxies/${galaxyId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to join galaxy');
      }

      fetchGalaxies();
      setJoiningGalaxy(null);
      setJoinPassword('');
    } catch (error) {
      alert(error.message);
    }
  };

  const createGalaxy = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://stormbrainer-galaxy.onrender.com/api/galaxies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create galaxy');
      }

      const newGalaxy = await response.json();
      fetchGalaxies();
      setIsCreateModalOpen(false);
      onEnterGalaxy(newGalaxy);
    } catch (error) {
      alert(error.message);
    }
  };

  const fetchGalaxies = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://stormbrainer-galaxy.onrender.com/api/galaxies?filter=${filter}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setGalaxies(data);
    } catch (error) {
      console.error('Failed to fetch galaxies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchGalaxies();
  }, [filter]);

  const filteredGalaxies = galaxies.filter(g => 
    (categoryFilter === 'All' || g.category === categoryFilter) &&
    g.status !== GALAXY_STATUS.DELETED
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center pb-4 border-b border-gray-300 dark:border-gray-700">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          Galaxies Available
        </h2>
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex gap-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              title="Grid View"
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              title="List View"
            >
              <List size={20} />
            </button>
          </div>
          
          {/* Create Galaxy Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} /> Create Galaxy
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 gap-4">
        <div className="flex space-x-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
          <button
            onClick={() => setFilter('public')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'public' 
                ? 'bg-white text-gray-900 shadow-md' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-600/50'
            }`}
          >
            Public Browsing
          </button>
          <button
            onClick={() => setFilter('joined')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'joined' 
                ? 'bg-white text-gray-900 shadow-md' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-600/50'
            }`}
          >
            My Galaxies
          </button>
        </div>

        {filter === 'public' && (
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        )}
      </div>

      {/* Galaxy Display */}
      {isLoading ? (
        <div className="text-center py-10">Loading Galaxies...</div>
      ) : filteredGalaxies.length === 0 ? (
        <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">
          {filter === 'joined' 
            ? 'You have not joined any galaxies yet.' 
            : 'No galaxies found in this category.'}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGalaxies.map(galaxy => (
            <GalaxyCard
              key={galaxy.id}
              galaxy={galaxy}
              onJoin={handleJoinClick}
              canJoin={canJoinGalaxy(galaxy)}
              canInteract={canInteractWithGalaxy(galaxy)}
              getStatusBadge={getStatusBadge}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredGalaxies.map(galaxy => (
            <GalaxyListItem
              key={galaxy.id}
              galaxy={galaxy}
              onJoin={handleJoinClick}
              canJoin={canJoinGalaxy(galaxy)}
              canInteract={canInteractWithGalaxy(galaxy)}
              getStatusBadge={getStatusBadge}
            />
          ))}
        </div>
      )}

      {/* Create Galaxy Modal */}
      <CreateGalaxyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={createGalaxy}
        categories={categories.filter(c => c !== 'All')}
      />

      {/* Private Galaxy Join Modal */}
      {joiningGalaxy && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Join Private Galaxy: {joiningGalaxy.name}
              </h3>
              <button onClick={() => setJoiningGalaxy(null)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              This galaxy requires a password to join.
            </p>
            <input
              type="password"
              placeholder="Enter galaxy password"
              value={joinPassword}
              onChange={(e) => setJoinPassword(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
            <button
              onClick={() => joinGalaxy(joiningGalaxy.id, joinPassword)}
              className="w-full p-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              Join Galaxy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Create Galaxy Modal Component
const CreateGalaxyModal = ({ isOpen, onClose, onCreate, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: categories[0] || 'General',
    is_public: true,
    password: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
    setFormData({
      name: '',
      description: '',
      category: categories[0] || 'General',
      is_public: true,
      password: ''
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
        <div className="flex justify-between items-center mb-4 border-b pb-3 border-gray-300 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-purple-500 dark:text-purple-400">Launch a New Galaxy 🪐</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Galaxy Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., 'Relativity Riddles'"
              required
              className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe your galaxy..."
              rows={3}
              className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
              className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.is_public}
                onChange={(e) => setFormData({...formData, is_public: e.target.checked, password: e.target.checked ? '' : formData.password})}
                className="form-checkbox h-5 w-5 text-purple-600"
              />
              <span className="text-gray-700 dark:text-gray-300">Public Galaxy</span>
            </label>
            
            {!formData.is_public && (
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Private Access Code"
                required
                className="flex-grow p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            Launch Galaxy
          </button>
        </form>
      </div>
    </div>
  );
};

// Galaxy Card (Grid View)
const GalaxyCard = ({ galaxy, onJoin, canJoin, canInteract, getStatusBadge }) => {
  const statusBadge = getStatusBadge(galaxy.status);

  return (
    <div className="p-6 bg-white/5 dark:bg-gray-800/70 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-600/30">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-2xl font-semibold text-purple-400 truncate flex-1">{galaxy.name}</h4>
        <span className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${statusBadge.color}`}>
          {statusBadge.icon}
          {statusBadge.text}
        </span>
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        Owner: <span className="font-semibold">{galaxy.owner_username}</span> | 
        Category: <span className="font-semibold">{galaxy.category}</span>
      </p>
      
      <p className="text-gray-700 dark:text-gray-300 line-clamp-2 mb-4">
        {galaxy.description || 'No description provided.'}
      </p>
      
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {galaxy.member_count || 0} members
        </div>
        
        {canJoin ? (
          galaxy.is_member ? (
            <button 
              onClick={() => onJoin(galaxy)}
              disabled={!canInteract}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                canInteract
                  ? 'bg-pink-500 hover:bg-pink-600'
                  : 'bg-gray-500 cursor-not-allowed'
              }`}
            >
              {canInteract ? 'Enter Galaxy 🚀' : 'View Only'}
            </button>
          ) : (
            <button 
              onClick={() => onJoin(galaxy)}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              {galaxy.status === 'private' ? 'Request Access 🔐' : 'Join'}
            </button>
          )
        ) : (
          <span className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-200 dark:bg-gray-700 rounded-lg">
            Unavailable
          </span>
        )}
      </div>
    </div>
  );
};

// Galaxy List Item (List View)
const GalaxyListItem = ({ galaxy, onJoin, canJoin, canInteract, getStatusBadge }) => {
  const statusBadge = getStatusBadge(galaxy.status);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-colors">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-xl font-semibold text-purple-400 truncate">{galaxy.name}</h4>
            <span className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${statusBadge.color}`}>
              {statusBadge.icon}
              {statusBadge.text}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {galaxy.description || 'No description'}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Owner: {galaxy.owner_username}</span>
            <span>•</span>
            <span>{galaxy.category}</span>
            <span>•</span>
            <span>{galaxy.member_count || 0} members</span>
          </div>
        </div>
        
        <div className="flex-shrink-0">
          {canJoin ? (
            galaxy.is_member ? (
              <button 
                onClick={() => onJoin(galaxy)}
                disabled={!canInteract}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors whitespace-nowrap ${
                  canInteract
                    ? 'bg-pink-500 hover:bg-pink-600'
                    : 'bg-gray-500 cursor-not-allowed'
                }`}
              >
                {canInteract ? 'Enter 🚀' : 'View Only'}
              </button>
            ) : (
              <button 
                onClick={() => onJoin(galaxy)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors whitespace-nowrap"
              >
                {galaxy.status === 'private' ? 'Join 🔐' : 'Join'}
              </button>
            )
          ) : (
            <span className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-200 dark:bg-gray-700 rounded-lg">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedGalaxyList;