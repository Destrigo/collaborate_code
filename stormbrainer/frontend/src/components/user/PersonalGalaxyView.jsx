import React, { useState, useEffect } from 'react';
import { Star, Target, Award, TrendingUp, Calendar } from 'lucide-react';

// Personal Galaxy View - Shows user's complete history
const PersonalGalaxyView = ({ user }) => {
  const [userHistory, setUserHistory] = useState({
    problemsCreated: [],
    solutionsSubmitted: [],
    stats: {
      totalProblems: 0,
      totalSolutions: 0,
      totalStarsEarned: 0,
      averageRating: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('visual'); // 'visual' or 'list'

  useEffect(() => {
    loadPersonalHistory();
  }, [user]);

  const loadPersonalHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch user's created problems
      const problemsResponse = await fetch(`https://stormbrainer-galaxy.onrender.com/api/users/${user.id}/problems`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch user's submitted solutions
      const solutionsResponse = await fetch(`https://stormbrainer-galaxy.onrender.com/api/users/${user.id}/solutions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const problemsData = problemsResponse.ok ? await problemsResponse.json() : [];
      const solutionsData = solutionsResponse.ok ? await solutionsResponse.json() : [];
      
      // Calculate stats
      const totalStarsEarned = [...problemsData, ...solutionsData].reduce((sum, item) => sum + (item.stars || 0), 0);
      const averageRating = totalStarsEarned / (problemsData.length + solutionsData.length) || 0;
      
      setUserHistory({
        problemsCreated: problemsData,
        solutionsSubmitted: solutionsData,
        stats: {
          totalProblems: problemsData.length,
          totalSolutions: solutionsData.length,
          totalStarsEarned: totalStarsEarned,
          averageRating: averageRating
        }
      });
    } catch (error) {
      console.error('Failed to load personal history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your galaxy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            My Galaxy 🌟
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Your complete journey through the cosmos
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex gap-2 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('visual')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewMode === 'visual'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Solar System
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            List View
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Target className="text-purple-500" />}
          label="Problems Created"
          value={userHistory.stats.totalProblems}
          color="purple"
        />
        <StatCard
          icon={<Star className="text-yellow-500" />}
          label="Solutions Submitted"
          value={userHistory.stats.totalSolutions}
          color="yellow"
        />
        <StatCard
          icon={<Award className="text-green-500" />}
          label="Stars Earned"
          value={userHistory.stats.totalStarsEarned}
          color="green"
        />
        <StatCard
          icon={<TrendingUp className="text-blue-500" />}
          label="Avg Rating"
          value={userHistory.stats.averageRating.toFixed(1)}
          color="blue"
        />
      </div>

      {/* Main Content */}
      {viewMode === 'visual' ? (
        <PersonalSolarSystem 
          problems={userHistory.problemsCreated}
          solutions={userHistory.solutionsSubmitted}
        />
      ) : (
        <PersonalHistoryList
          problems={userHistory.problemsCreated}
          solutions={userHistory.solutionsSubmitted}
        />
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    purple: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700',
    yellow: 'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700',
    green: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700',
    blue: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border-2 rounded-lg p-4 text-center`}>
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{label}</div>
    </div>
  );
};

// Personal Solar System Visualization
const PersonalSolarSystem = ({ problems, solutions }) => {
  return (
    <div className="relative w-full h-[70vh] bg-gradient-to-b from-indigo-950 via-purple-900 to-black rounded-xl overflow-hidden">
      {/* Starry background */}
      <div className="absolute inset-0">
        {[...Array(150)].map((_, i) => (
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

      {/* Central User Avatar */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-purple-400 opacity-30 blur-3xl animate-pulse" 
               style={{ width: '200px', height: '200px', margin: '-50px' }} />
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl flex items-center justify-center animate-pulse">
            <span className="text-5xl">👤</span>
          </div>
        </div>
      </div>

      {/* Problems as planets */}
      {problems.map((problem, idx) => (
        <OrbitingItem
          key={`problem-${problem.id}`}
          item={problem}
          type="problem"
          index={idx}
          total={problems.length + solutions.length}
        />
      ))}

      {/* Solutions as asteroids */}
      {solutions.map((solution, idx) => (
        <OrbitingItem
          key={`solution-${solution.id}`}
          item={solution}
          type="solution"
          index={idx + problems.length}
          total={problems.length + solutions.length}
        />
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-4 text-white text-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
          <span>Your Problems</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
          <span>Your Solutions</span>
        </div>
      </div>
    </div>
  );
};

// Orbiting Item (Problem or Solution)
const OrbitingItem = ({ item, type, index, total }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setRotation(prev => (prev + 0.1) % 360), 50);
    return () => clearInterval(interval);
  }, []);

  const baseRadius = type === 'problem' ? 100 : 80;
  const orbitRadius = baseRadius + (index * 40);
  const size = type === 'problem' ? 40 : 20;
  const startAngle = (index * 360) / total;

  const angle = ((rotation + startAngle) * Math.PI) / 180;
  const x = 50 + (orbitRadius / 5) * Math.cos(angle);
  const y = 50 + (orbitRadius / 5) * Math.sin(angle);

  return (
    <>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 pointer-events-none"
        style={{ width: `${(orbitRadius / 2.5)}%`, height: `${(orbitRadius / 2.5)}%` }}
      />
      
      <div
        className="absolute cursor-pointer transition-transform hover:scale-125 z-20"
        style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
        title={type === 'problem' ? item.title : `Solution to: ${item.problem_title}`}
      >
        {type === 'problem' ? (
          <div
            className="relative rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-xl border-2 border-white/20"
            style={{ width: `${size}px`, height: `${size}px` }}
          >
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {item.stars || 0}
            </div>
          </div>
        ) : (
          <div
            className="relative rounded-full bg-gradient-to-br from-gray-400 to-gray-600 shadow-lg"
            style={{ 
              width: `${size}px`, 
              height: `${size}px`,
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
            }}
          >
            {item.stars > 0 && (
              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                {item.stars}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

// List View
const PersonalHistoryList = ({ problems, solutions }) => {
  const [activeTab, setActiveTab] = useState('problems');

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('problems')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'problems'
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Problems Created ({problems.length})
        </button>
        <button
          onClick={() => setActiveTab('solutions')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'solutions'
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Solutions Submitted ({solutions.length})
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {activeTab === 'problems' ? (
          problems.length > 0 ? (
            problems.map(problem => (
              <div key={problem.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{problem.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Galaxy: {problem.galaxy_name} • {problem.solution_count || 0} solutions
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} fill="gold" className="text-yellow-400" />
                    <span className="font-bold">{problem.stars || 0}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              You haven't created any problems yet
            </p>
          )
        ) : (
          solutions.length > 0 ? (
            solutions.map(solution => (
              <div key={solution.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">{solution.text.substring(0, 100)}...</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Problem: {solution.problem_title} • Galaxy: {solution.galaxy_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} fill="gold" className="text-yellow-400" />
                    <span className="font-bold">{solution.stars || 0}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              You haven't submitted any solutions yet
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default PersonalGalaxyView;