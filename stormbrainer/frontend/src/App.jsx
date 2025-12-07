// export default App;
import { useState, useEffect, useMemo } from "react";
import { Loader2, Star, LogOut, Sun, Moon, User } from "lucide-react";
import AuthComponent from "./components/auth/LoginForm";
import GalaxyViewComponent from "./components/galaxy/GalaxyView";
import LeaderboardComponent from "./components/Leaderboard";
import GalaxyListComponent from "./components/galaxy/GalaxyList";
import UserProfileModal from "./components/user/UserProfileModal";
import { getCurrentUser } from "./services/api";

// ============================================
// SOLAR SYSTEM COMPONENTS - ADD THESE
// ============================================

// Solar System Galaxy Visualization Component
const SolarSystemGalaxy = ({ problems, onProblemClick }) => {
  if (!problems || problems.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400">
        No problems in this galaxy yet
      </div>
    );
  }

  return (
    <div className="relative w-full h-[80vh] min-h-[500px] bg-gradient-to-b from-indigo-950 via-purple-900 to-black rounded-xl overflow-hidden">
      {/* Starry background */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
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

      {/* Central Sun */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative">
          {/* Sun glow effect */}
          <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-30 blur-3xl animate-pulse" 
               style={{ width: '150px', height: '150px', margin: '-25px' }} />
          
          {/* Sun core */}
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500 shadow-2xl flex items-center justify-center animate-pulse">
            <Star className="w-12 h-12 text-white" fill="white" />
          </div>
        </div>
      </div>

      {/* Orbiting Problems as Planets */}
      {problems.map((problem, index) => (
        <OrbitingPlanet
          key={problem.id}
          problem={problem}
          orbitIndex={index}
          totalPlanets={problems.length}
          onClick={() => onProblemClick(problem)}
        />
      ))}
    </div>
  );
};

// Individual Orbiting Planet Component
const OrbitingPlanet = ({ problem, orbitIndex, totalPlanets, onClick }) => {
  const [rotation, setRotation] = useState(0);

  // Calculate orbit radius (distance from sun)
  const baseOrbitRadius = 120;
  const orbitRadius = baseOrbitRadius + (orbitIndex * 60);
  
  // Calculate planet size based on stars (rating)
  const baseSize = 40;
  const planetSize = Math.min(baseSize + (problem.stars || 0) * 3, 80);
  
  // Much slower orbit speeds for smoother animation (60-100 seconds per orbit)
  const orbitSpeed = 60 + (orbitIndex * 10);
  
  // Different starting positions to spread planets
  const startAngle = (orbitIndex * 360) / totalPlanets;

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.1) % 360); // Slower increment for smoother animation
    }, 50); // Update more frequently but with smaller steps

    return () => clearInterval(interval);
  }, []);

  // Calculate planet position
  const angle = ((rotation + startAngle) * Math.PI) / 180;
  const x = 50 + (orbitRadius / 6) * Math.cos(angle);
  const y = 50 + (orbitRadius / 6) * Math.sin(angle);

  // Planet colors based on index
  const planetColors = [
    'from-blue-400 to-blue-600',
    'from-red-400 to-red-600',
    'from-green-400 to-green-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-cyan-400 to-cyan-600',
    'from-orange-400 to-orange-600',
    'from-teal-400 to-teal-600',
  ];

  return (
    <>
      {/* Orbit path */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
        style={{
          width: `${(orbitRadius / 3)}%`,
          height: `${(orbitRadius / 3)}%`,
        }}
      />

      {/* Planet */}
      <div
        className="absolute cursor-pointer transition-transform hover:scale-125 z-20"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: 'translate(-50%, -50%)',
        }}
        onClick={onClick}
      >
        {/* Planet glow */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${planetColors[orbitIndex % planetColors.length]} opacity-40 blur-xl`}
          style={{ width: `${planetSize + 20}px`, height: `${planetSize + 20}px`, margin: '-10px' }}
        />

        {/* Planet body */}
        <div
          className={`relative rounded-full bg-gradient-to-br ${planetColors[orbitIndex % planetColors.length]} shadow-2xl flex items-center justify-center border-2 border-white/20`}
          style={{ width: `${planetSize}px`, height: `${planetSize}px` }}
        >
          {/* Planet texture/pattern */}
          <div className="absolute inset-0 rounded-full opacity-20 bg-gradient-to-br from-white/30 via-transparent to-black/30" />
          
          {/* Planet title (on hover) */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-white text-xs whitespace-nowrap pointer-events-none">
            {problem.title}
          </div>
        </div>

        {/* Star rating badge */}
        <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full px-2 py-1 text-xs font-bold flex items-center gap-1 shadow-lg">
          <Star size={12} fill="currentColor" className="text-yellow-600" />
          {problem.stars || 0}
        </div>
      </div>
    </>
  );
};

// ============================================
// MAIN APP COMPONENT
// ============================================

const App = () => {
    const [user, setUser] = useState(null);
    const [view, setView] = useState('browser'); 
    const [currentGalaxy, setCurrentGalaxy] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? savedTheme === 'dark' : true; 
    });

    // Generate stars once on mount
    const stars = useMemo(() => {
        return Array.from({ length: 200 }).map(() => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 1,
            duration: Math.random() * 3 + 2
        }));
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await getCurrentUser();
                    setUser(userData);
                } catch (error) {
                    localStorage.removeItem('token'); 
                    setUser(null);
                }
            }
            setLoadingAuth(false);
        };
        checkAuth();
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);
    
    const handleLogin = (userData) => {
        setUser(userData);
        setView('browser');
    };

    const handleUpdateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setCurrentGalaxy(null);
        setView('browser');
    };

    const enterGalaxy = (galaxy) => {
        setCurrentGalaxy(galaxy);
        setView('galaxy');
    };

    const renderContent = () => {
        if (loadingAuth) {
            return (
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="animate-spin mr-3 text-purple-500" size={40} />
                    <span className="text-xl text-gray-500 dark:text-gray-400">Checking credentials...</span>
                </div>
            );
        }
        
        if (!user) {
            return <AuthComponent onLogin={handleLogin} />;
        }

        if (view === 'galaxy' && currentGalaxy) {
            return (
                <GalaxyViewComponent 
                    user={user} 
                    galaxy={currentGalaxy} 
                    goBack={() => { setView('browser'); setCurrentGalaxy(null); }}
                    SolarSystemGalaxy={SolarSystemGalaxy}
                />
            );
        }
        
        if (view === 'leaderboard') {
            return <LeaderboardComponent />;
        }
        
        return <GalaxyListComponent user={user} onEnterGalaxy={enterGalaxy} />;
    };

    return (
        <div className="min-h-screen font-sans antialiased transition-colors duration-300 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Starry Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
                    {stars.map((star, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-white"
                            style={{
                                left: `${star.x}%`,
                                top: `${star.y}%`,
                                width: `${star.size}px`,
                                height: `${star.size}px`,
                                opacity: 0.6,
                                animation: `twinkle ${star.duration}s ease-in-out infinite`,
                                animationDelay: `${Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>
            </div>
            
            {/* Header */}
            <header className="sticky top-0 z-50 p-4 border-b border-gray-200 dark:border-gray-800 backdrop-blur-md bg-white/70 dark:bg-gray-900/80">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <h1 
                        className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 cursor-pointer"
                        onClick={() => setView('browser')}
                    >
                        StormBrainer 🌌
                    </h1>
                    <nav className="flex items-center space-x-2 sm:space-x-4">
                        {user && (
                            <>
                                <button
                                    onClick={() => setView('browser')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors hidden sm:block ${
                                        view === 'browser' 
                                            ? 'bg-purple-600 text-white' 
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    Galaxies
                                </button>
                                <button
                                    onClick={() => setView('leaderboard')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors hidden sm:block ${
                                        view === 'leaderboard' 
                                            ? 'bg-yellow-500 text-gray-900' 
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    Leaderboard ⭐
                                </button>
                                
                                {/* USER PROFILE SECTION - NEW */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        {/* Avatar */}
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        
                                        {/* User Info - Hidden on mobile */}
                                        <div className="text-left hidden lg:block">
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {user.username}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                <Star size={10} fill="gold" className="text-yellow-500" />
                                                {user.rating || 0}
                                            </div>
                                        </div>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showProfileMenu && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                                            <button
                                                onClick={() => {
                                                    setIsProfileOpen(true);
                                                    setShowProfileMenu(false);
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-900 dark:text-white transition-colors"
                                            >
                                                <User size={16} />
                                                View Profile
                                            </button>
                                            <hr className="my-2 border-gray-200 dark:border-gray-700" />
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-red-600 dark:text-red-400 transition-colors"
                                            >
                                                <LogOut size={16} />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto p-4 sm:p-6">
                {renderContent()}
            </main>

            {/* User Profile Modal */}
            {user && (
                <UserProfileModal
                    user={user}
                    isOpen={isProfileOpen}
                    onClose={() => setIsProfileOpen(false)}
                    onUpdateUser={handleUpdateUser}
                />
            )}
        </div>
    );
};

export default App;