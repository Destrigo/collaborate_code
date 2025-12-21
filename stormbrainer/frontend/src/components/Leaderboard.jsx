import React, { useState, useEffect } from 'react';
import { Star, Trophy, Medal, Crown } from 'lucide-react';

const VisualLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'solar'
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://stormbrainer-galaxy.onrender.com/api/leaderboard');
      const data = await response.json();
      setLeaderboard(data);
    } catch (err) {
      setError(err.message || 'Failed to load leaderboard.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <span className="text-4xl">🏆</span>;
      case 2: return <span className="text-3xl">🥈</span>;
      case 3: return <span className="text-2xl">🥉</span>;
      default: return <span className="text-xl text-gray-500 dark:text-gray-400">{rank}</span>;
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-xl text-gray-400">Loading Leaderboard...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-xl text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header with Toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600">
          ⭐ Galaxy Leaderboard ⭐
        </h2>
        
        <div className="flex gap-2 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewMode === 'table'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewMode('solar')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewMode === 'solar'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Solar System
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'table' ? (
        <TableView leaderboard={leaderboard} getRankIcon={getRankIcon} />
      ) : (
        <SolarSystemView leaderboard={leaderboard} />
      )}
    </div>
  );
};

// Traditional Table View
const TableView = ({ leaderboard, getRankIcon }) => {
  return (
    <div className="p-6 bg-gray-900/50 rounded-xl shadow-2xl backdrop-blur-md border border-yellow-500/30">
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
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-lg font-semibold text-white">{user.username}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-xl font-bold text-yellow-400">
                {user.rating}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {leaderboard.length === 0 && (
        <p className="text-center py-8 text-gray-500">No users found on the leaderboard yet.</p>
      )}
    </div>
  );
};

// Solar System View
const SolarSystemView = ({ leaderboard }) => {
  const topUsers = leaderboard.slice(0, 20); // Show top 20 users

  return (
    <div className="relative w-full h-[80vh] bg-gradient-to-b from-indigo-950 via-purple-900 to-black rounded-xl overflow-hidden">
      {/* Starry background */}
      <div className="absolute inset-0">
        {[...Array(200)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7 + 0.3,
              animationDuration: Math.random() * 3 + 2 + 's',
              animationDelay: Math.random() * 2 + 's'
            }}
          />
        ))}
      </div>

      {/* Central Trophy Sun */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-30 blur-3xl animate-pulse" 
               style={{ width: '250px', height: '250px', margin: '-62.5px' }} />
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500 shadow-2xl flex items-center justify-center animate-pulse">
            <Trophy className="w-16 h-16 text-white" fill="white" />
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-white font-bold text-sm whitespace-nowrap">
            Top Coders
          </div>
        </div>
      </div>

      {/* Users as orbiting planets */}
      {topUsers.map((user, index) => (
        <LeaderboardPlanet
          key={user.id}
          user={user}
          index={index}
          totalUsers={topUsers.length}
        />
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-4 text-white text-sm space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500"></div>
          <span>Top 3</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-500"></div>
          <span>Top 10</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500"></div>
          <span>Top 20</span>
        </div>
      </div>
    </div>
  );
};

// Individual Leaderboard Planet
const LeaderboardPlanet = ({ user, index, totalUsers }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setRotation(prev => (prev + 0.08) % 360), 50);
    return () => clearInterval(interval);
  }, []);

  // Size based on rank
  const getPlanetSize = (rank) => {
    if (rank === 1) return 60;
    if (rank === 2) return 55;
    if (rank === 3) return 50;
    if (rank <= 10) return 40;
    return 30;
  };

  // Color based on rank
  const getPlanetColor = (rank) => {
    if (rank === 1) return 'from-yellow-400 to-orange-500';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-yellow-700 to-orange-700';
    if (rank <= 10) return 'from-purple-400 to-pink-500';
    return 'from-blue-400 to-cyan-500';
  };

  const baseOrbitRadius = 100;
  const orbitRadius = baseOrbitRadius + (index * 35);
  const planetSize = getPlanetSize(user.rank);
  const planetColor = getPlanetColor(user.rank);
  const startAngle = (index * 360) / totalUsers;

  const angle = ((rotation + startAngle) * Math.PI) / 180;
  const x = 50 + (orbitRadius / 5) * Math.cos(angle);
  const y = 50 + (orbitRadius / 5) * Math.sin(angle);

  const getRankBadge = (rank) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  return (
    <>
      {/* Orbit path */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 pointer-events-none"
        style={{ width: `${(orbitRadius / 2.5)}%`, height: `${(orbitRadius / 2.5)}%` }}
      />

      {/* Planet */}
      <div
        className="absolute cursor-pointer transition-transform hover:scale-125 z-20 group"
        style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
      >
        {/* Planet glow */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${planetColor} opacity-40 blur-xl`}
          style={{ width: `${planetSize + 20}px`, height: `${planetSize + 20}px`, margin: '-10px' }}
        />

        {/* Planet body */}
        <div
          className={`relative rounded-full bg-gradient-to-br ${planetColor} shadow-2xl flex items-center justify-center border-2 border-white/20`}
          style={{ width: `${planetSize}px`, height: `${planetSize}px` }}
        >
          {/* User initial */}
          <span className="text-white font-bold" style={{ fontSize: `${planetSize / 3}px` }}>
            {user.username.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Rank badge */}
        <div className="absolute -top-2 -left-2 bg-black/80 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold text-white border-2 border-white/30">
          {getRankBadge(user.rank)}
        </div>

        {/* Rating badge */}
        <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full px-2 py-1 text-xs font-bold flex items-center gap-1 shadow-lg">
          <Star size={10} fill="currentColor" className="text-yellow-600" />
          {user.rating}
        </div>

        {/* Tooltip */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 px-3 py-2 rounded-lg text-white text-sm whitespace-nowrap pointer-events-none z-30">
          <div className="font-bold">{user.username}</div>
          <div className="text-xs text-gray-300">Rank #{user.rank} • {user.rating} stars</div>
        </div>
      </div>
    </>
  );
};

export default VisualLeaderboard;