// frontend/src/components/user/UserProfile.jsx

import React, { useState, useEffect } from 'react';
import { Star, Award, TrendingUp, Globe, Users, Target, X, Edit2, Save } from 'lucide-react';
import { getUserStats, updateUserProfile, getUserAchievements } from '../../services/api';

// User Profile Modal Component
const UserProfileModal = ({ user, isOpen, onClose, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user?.username || '');
  const [stats, setStats] = useState({
    totalSolutions: 0,
    totalProblems: 0,
    galaxiesJoined: 0,
    averageRating: 0,
    rank: 0,
    totalUsers: 0
  });
  const [achievements, setAchievements] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (isOpen && user) {
      setEditedUsername(user.username);
      loadUserStats();
      loadAchievements();
    }
  }, [isOpen, user]);

  const loadUserStats = async () => {
    try {
      const data = await getUserStats(user.id);
      setStats(data.stats);
      setRecentActivity(data.recentActivity || []);
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const loadAchievements = async () => {
    try {
      const data = await getUserAchievements(user.id);
      setAchievements(data.achievements || []);
    } catch (error) {
      console.error('Failed to load achievements:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updated = await updateUserProfile(user.id, { username: editedUsername });
      onUpdateUser(updated);
      setIsEditing(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const displayAchievements = achievements.length > 0 
    ? achievements 
    : [{ icon: '🌱', name: 'Newcomer', desc: 'Just getting started!', unlocked: true }];

  const getRankBadge = () => {
    if (stats.rank <= 10) return { color: 'from-yellow-400 to-orange-500', label: 'Top 10', icon: '👑' };
    if (stats.rank <= 50) return { color: 'from-purple-400 to-pink-500', label: 'Top 50', icon: '💎' };
    if (stats.rank <= 100) return { color: 'from-blue-400 to-cyan-500', label: 'Top 100', icon: '🌟' };
    return { color: 'from-gray-400 to-gray-600', label: `#${stats.rank}`, icon: '🔵' };
  };

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  const rankBadge = getRankBadge();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl font-bold text-white shadow-xl border-4 border-white/30">
              {user.username.charAt(0).toUpperCase()}
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-white">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedUsername}
                    onChange={(e) => setEditedUsername(e.target.value)}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/60 text-xl font-bold"
                  />
                  <button
                    onClick={handleSaveProfile}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <Save size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-3xl font-bold">{user.username}</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              )}
              <p className="text-white/80 text-sm mt-1">{user.email}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Star size={16} fill="gold" className="text-yellow-300" />
                  <span className="font-bold">{user.rating || 0}</span>
                </div>
                <div className={`flex items-center gap-2 bg-gradient-to-r ${rankBadge.color} px-3 py-1 rounded-full text-white font-bold`}>
                  <span>{rankBadge.icon}</span>
                  <span>{rankBadge.label}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Target className="text-purple-500" />}
            label="Solutions"
            value={stats.totalSolutions}
            color="purple"
          />
          <StatCard
            icon={<Globe className="text-blue-500" />}
            label="Problems"
            value={stats.totalProblems}
            color="blue"
          />
          <StatCard
            icon={<Users className="text-green-500" />}
            label="Galaxies"
            value={stats.galaxiesJoined}
            color="green"
          />
          <StatCard
            icon={<TrendingUp className="text-orange-500" />}
            label="Avg Rating"
            value={stats.averageRating}
            color="orange"
          />
        </div>

        {/* Achievements */}
        <div className="px-6 pb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <Award className="text-yellow-500" size={24} />
            Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {displayAchievements.map((achievement, idx) => (
              <div
                key={idx}
                className={`${achievement.unlocked 
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-700' 
                  : 'bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 opacity-50'
                } rounded-lg p-4 flex items-center gap-3`}
              >
                <span className="text-3xl">{achievement.icon}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white">{achievement.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.desc}</p>
                </div>
                {achievement.unlocked && <span className="ml-auto text-green-500 text-xl">✓</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Activity Summary */}
        <div className="px-6 pb-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Recent Activity</h3>
          <div className="space-y-2">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, idx) => (
                <ActivityItem
                  key={idx}
                  icon={activity.icon}
                  text={activity.text}
                  time={formatRelativeTime(activity.time)}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No recent activity yet. Start solving problems!
              </p>
            )}
          </div>
        </div>

        {/* Member Since */}
        <div className="px-6 pb-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Member since {new Date(user.created_at || Date.now()).toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          })}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    purple: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700',
    blue: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700',
    green: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700',
    orange: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border-2 rounded-lg p-4 text-center`}>
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{label}</div>
    </div>
  );
};

// Activity Item Component
const ActivityItem = ({ icon, text, time }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
    <span className="text-2xl">{icon}</span>
    <div className="flex-1">
      <p className="text-sm text-gray-900 dark:text-white">{text}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
    </div>
  </div>
);

export default UserProfileModal;