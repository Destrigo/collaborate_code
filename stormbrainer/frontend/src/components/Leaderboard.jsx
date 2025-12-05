// frontend/src/components/Leaderboard.jsx

import React, { useState, useEffect } from 'react';
import { getLeaderboardData } from '../services/api';

/**
 * @description Component to display the global user ranking.
 */
const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const data = await getLeaderboardData();
                setLeaderboard(data);
            } catch (err) {
                setError(err.message || 'Failed to load leaderboard.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    // Helper function to render trophy icons for top ranks
    const getRankIcon = (rank) => {
        switch (rank) {
            case 1:
                return <span className="text-3xl text-yellow-500">🏆</span>;
            case 2:
                return <span className="text-2xl text-gray-400">🥈</span>;
            case 3:
                return <span className="text-xl text-yellow-700">🥉</span>;
            default:
                return <span className="text-lg text-gray-500 dark:text-gray-400">{rank}</span>;
        }
    };

    if (isLoading) {
        return <div className="text-center py-20 text-xl text-gray-400">Loading Leaderboard...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-xl text-red-500">Error: {error}</div>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-gray-900/50 rounded-xl shadow-2xl backdrop-blur-md border border-yellow-500/30">
            <h2 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600">
                ⭐ Galaxy StormBrainer Leaderboard ⭐
            </h2>
            
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800/70">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider w-1/12">Rank</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Username</th>
                        <th className="px-6 py-3 text-right text-sm font-medium text-gray-300 uppercase tracking-wider w-1/4">Rating (Stars)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {leaderboard.map((user, index) => (
                        <tr 
                            key={user.id} 
                            className={`transition-colors ${index < 3 ? 'bg-yellow-900/20' : 'hover:bg-gray-800'}`}
                        >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                {getRankIcon(user.rank)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-lg font-semibold text-white">
                                {user.username}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-xl font-bold text-yellow-400">
                                {user.rating} 
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {leaderboard.length === 0 && (
                <p className="text-center py-8 text-gray-500">No users found on the leaderboard yet. Be the first to earn a star!</p>
            )}
        </div>
    );
};

export default Leaderboard;