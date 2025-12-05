// frontend/src/components/galaxy/GalaxyList.jsx

import React, { useState } from 'react';
import { useGalaxy } from '../../hooks/useGalaxy';
import { getCategories } from '../../services/api';
import GalaxyCard from './GalaxyCard';
import CreateGalaxyModal from './CreateGalaxyModal';
import Modal from '../common/Modal'; // Assuming generic Modal component exists

// Mock Modal Component (Full implementation needed in common/Modal.jsx)
const MockModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-lg p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-2xl transition-all">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl">
                        &times;
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

const GalaxyList = ({ onEnterGalaxy }) => {
    const { galaxies, isLoading, filter, setFilter, createGalaxy, joinGalaxy, refreshGalaxies } = useGalaxy();
    const categories = getCategories();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [joinPassword, setJoinPassword] = useState('');
    const [joiningGalaxy, setJoiningGalaxy] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('All');

    // Filter galaxies by category on the client side for the 'public' list view
    const filteredGalaxies = galaxies.filter(g => 
        categoryFilter === 'All' || g.category === categoryFilter
    );

    const handleJoinClick = (galaxy) => {
        if (galaxy.is_public) {
            joinGalaxy(galaxy.id).then(() => {
                onEnterGalaxy(galaxy);
            }).catch(err => alert(err.message));
        } else {
            setJoiningGalaxy(galaxy);
        }
    };

    const submitJoinPassword = async () => {
        try {
            await joinGalaxy(joiningGalaxy.id, joinPassword);
            onEnterGalaxy(joiningGalaxy);
            setJoiningGalaxy(null);
            setJoinPassword('');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center pb-4 border-b border-gray-300 dark:border-gray-700">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                    Galaxies Available
                </h2>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 transition-colors flex items-center"
                >
                    <span className="text-xl mr-2">+</span> Create New Galaxy
                </button>
            </header>

            {/* Filtering and Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                {/* Tabs for Public vs Joined */}
                <div className="flex space-x-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
                    <button
                        onClick={() => setFilter('public')}
                        className={`px-4 py-2 rounded-md transition-colors ${filter === 'public' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-600/50'}`}
                    >
                        Public Browsing
                    </button>
                    <button
                        onClick={() => setFilter('joined')}
                        className={`px-4 py-2 rounded-md transition-colors ${filter === 'joined' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-600/50'}`}
                    >
                        My Joined Galaxies
                    </button>
                </div>

                {/* Category Filter (Visible only for 'public' filter) */}
                {filter === 'public' && (
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                        <option value="All">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* Galaxy Grid */}
            {isLoading && <p className="text-center py-10">Loading Galaxies...</p>}
            
            {!isLoading && filteredGalaxies.length === 0 && (
                <p className="col-span-3 text-center text-gray-500 dark:text-gray-400 py-10">
                    {filter === 'joined' ? 'You have not joined any galaxies yet. Find one in the Public Browsing tab!' : 'No public galaxies found in this category.'}
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGalaxies.map(galaxy => (
                    <GalaxyCard
                        key={galaxy.id}
                        galaxy={galaxy}
                        onJoin={handleJoinClick}
                        onEnter={onEnterGalaxy}
                    />
                ))}
            </div>

            {/* Modals */}
            <CreateGalaxyModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                onCreateSuccess={(data) => {
                    // Create galaxy, then enter it on success
                    return createGalaxy(data).then(newGalaxy => {
                        onEnterGalaxy(newGalaxy);
                        return newGalaxy;
                    });
                }}
            />

            <MockModal 
                isOpen={!!joiningGalaxy} 
                onClose={() => setJoiningGalaxy(null)} 
                title={`Join Private Galaxy: ${joiningGalaxy?.name}`}
            >
                <p className="mb-4 text-gray-300">This galaxy requires a secret access code.</p>
                <input
                    type="password"
                    placeholder="Galaxy Access Code"
                    value={joinPassword}
                    onChange={(e) => setJoinPassword(e.target.value)}
                    required
                    className="w-full p-3 mb-4 rounded-lg bg-gray-100 dark:bg-gray-700"
                />
                <button
                    onClick={submitJoinPassword}
                    className="w-full p-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors"
                >
                    Authenticate & Join
                </button>
            </MockModal>
        </div>
    );
};

export default GalaxyList;