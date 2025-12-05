import { useState, useEffect, useMemo } from "react";
import { Loader2, Star, LogOut, Sun, Moon } from "lucide-react";
import AuthComponent from "./components/auth/LoginForm";
import GalaxyViewComponent from "./components/galaxy/GalaxyView";
import LeaderboardComponent from "./components/Leaderboard";
import GalaxyListComponent from "./components/galaxy/GalaxyList";
import { getCurrentUser } from "./services/api";

const App = () => {
    const [user, setUser] = useState(null);
    const [view, setView] = useState('browser'); 
    const [currentGalaxy, setCurrentGalaxy] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    
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
                                
                                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 px-3 py-1.5 rounded-full flex items-center bg-white/50 dark:bg-gray-800/50">
                                    {user.username} 
                                    <span className="ml-2 text-yellow-500 flex items-center">
                                        {user.rating || 0} <Star size={14} className="ml-0.5 fill-yellow-500" />
                                    </span>
                                </span>
                                <button 
                                    onClick={handleLogout} 
                                    className="p-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
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
        </div>
    );
};

export default App;
