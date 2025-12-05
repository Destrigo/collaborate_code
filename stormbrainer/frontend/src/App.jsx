import { useState, useEffect } from "react";
import { Loader2, Star, LogOut, Sun, Moon } from "lucide-react";
import AuthComponent from "./components/auth/LoginForm";
import GalaxyViewComponent from "./components/galaxy/GalaxyView";
import LeaderboardComponent from "./components/Leaderboard";
import GalaxyListComponent from "./components/galaxy/GalaxyList";
import { getCurrentUser } from "./services/api";
import { MOCK_USERS } from "./tests/mockUsers";


const App = () => {
    const [user, setUser] = useState(null);
    const [view, setView] = useState('browser'); 
    const [currentGalaxy, setCurrentGalaxy] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    
    // Default to dark mode for a space-themed app
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? savedTheme === 'dark' : true; 
    });


    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
            } catch (error) {
                localStorage.removeItem('token'); 
                setUser(null);
            } finally {
                setLoadingAuth(false);
            }
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
        const existingUser = MOCK_USERS.find(u => u.id === userData.id);
        if (existingUser) {
            setUser(existingUser); 
        } else {
            setUser(userData);
        }
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

    const StarryBackground = () => (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-stars-animation dark:bg-gray-900"></div>
        </div>
    );

    const renderContent = () => {
        if (loadingAuth) {
            return (
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="animate-spin mr-3 text-purple-500" size={40} />
                    <span className="text-xl text-gray-500 dark:text-gray-400">Checking credentials...</span>
                </div>
            );
        }
        
        // This is where Auth would be imported: <Auth onLogin={handleLogin} />
        if (!user) {
            return <AuthComponent onLogin={handleLogin} />;
        }

        // This is where GalaxyView would be imported: <GalaxyView ... />
        if (view === 'galaxy' && currentGalaxy) {
            return (
                <GalaxyViewComponent 
                    user={user} 
                    galaxy={currentGalaxy} 
                    goBack={() => { setView('browser'); setCurrentGalaxy(null); }} 
                />
            );
        }
        
        // This is where Leaderboard would be imported: <Leaderboard />
        if (view === 'leaderboard') {
            return <LeaderboardComponent />;
        }
        
        // Default view: Galaxy Browser (GalaxyList import)
        return <GalaxyListComponent user={user} onEnterGalaxy={enterGalaxy} />;
    };

    return (
        <div className="min-h-screen font-sans antialiased transition-colors duration-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <StarryBackground />
            
            <header className="sticky top-0 z-50 p-4 border-b border-gray-200 dark:border-gray-800 backdrop-blur-md bg-opacity-70 dark:bg-gray-900/80">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <h1 
                        className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 cursor-pointer"
                        onClick={() => setView('browser')}
                    >
                        StormBrainer 🌌
                    </h1>
                    <nav className="flex items-center space-x-4">
                        {user && (
                            <>
                                {/* View Switchers */}
                                <button
                                    onClick={() => setView('browser')}
                                    className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors hidden sm:block ${view === 'browser' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                                >
                                    Galaxies
                                </button>
                                <button
                                    onClick={() => setView('leaderboard')}
                                    className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors hidden sm:block ${view === 'leaderboard' ? 'bg-yellow-500 text-gray-900' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                                >
                                    Leaderboard ⭐
                                </button>
                                
                                {/* User Info & Logout */}
                                <span className="text-sm font-semibold text-gray-400 border border-gray-700 px-3 py-1 rounded-full flex items-center bg-gray-800/50">
                                    {user.username} <span className="ml-2 text-yellow-400 flex items-center">{user.rating} <Star size={14} className="ml-0.5 fill-yellow-400" /></span>
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
                        {/* Dark/Light Mode Toggle */}
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

            <main className="max-w-7xl mx-auto p-4">
                {renderContent()}
            </main>
            
            <style jsx="true" global="true">{`
              @keyframes twinkle {
                0%, 100% { transform: scale(1); opacity: 0.5; }
                50% { transform: scale(1.3); opacity: 1; }
              }
              
              .bg-stars-animation {
                /* Box-shadow stars are generated here */
                box-shadow: 
                  ${Array.from({ length: 1500 }).map(() => {
                    const x = Math.floor(Math.random() * 100);
                    const y = Math.floor(Math.random() * 100);
                    const size = Math.random() * 1.5 + 0.5;
                    return `${x}vw ${y}vh 0 ${size}px #fff`;
                  }).join(', ')};
                
                &::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  box-shadow: 
                    ${Array.from({ length: 50 }).map(() => {
                      const x = Math.floor(Math.random() * 100);
                      const y = Math.floor(Math.random() * 100);
                      const size = Math.random() * 2 + 1;
                      return `${x}vw ${y}vh 0 ${size}px rgba(255, 255, 255, 0.7)`;
                    }).join(', ')};
                  animation: twinkle 5s infinite alternate;
                }
              }
            `}</style>
        </div>
    );
};

export default App;

// // frontend/src/App.jsx

// import React, { useState, useEffect } from 'react';
// // Assuming Auth component is a wrapper that handles LoginForm/RegisterForm
// import Auth from './components/Auth'; 
// import GalaxyList from './components/galaxy/GalaxyList'; // Renamed from PublicGalaxyBrowser
// import GalaxyView from './components/galaxy/GalaxyView'; 
// import Leaderboard from './components/Leaderboard'; // New import for the final feature
// import { getCurrentUser } from './services/api';

// // Main App Component
// const App = () => {
//   // State for user authentication, view navigation, and dark mode
//   const [user, setUser] = useState(null);
//   // Expanded view states: 'browser', 'leaderboard', 'galaxy'
//   const [view, setView] = useState('browser'); 
//   const [currentGalaxy, setCurrentGalaxy] = useState(null);
//   const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

//   // Load user data on component mount
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const userData = await getCurrentUser();
//         setUser(userData);a
//       } catch (error) {
//         // Clear token if fetching fails
//         localStorage.removeItem('token'); 
//         setUser(null);
//       }
//     };
//     checkAuth();
//   }, []);

//   // Effect to manage dark mode class on the HTML body
//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add('dark');
//       localStorage.setItem('theme', 'dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//       localStorage.setItem('theme', 'light');
//     }
//   }, [darkMode]);

//   // Handle successful login
//   const handleLogin = (userData) => {
//     setUser(userData);
//     setView('browser'); // Direct to browser after login
//   };

//   // Handle logout
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     setCurrentGalaxy(null);
//     setView('browser'); // Return to public view after logout
//   };

//   // Switch to Galaxy View
//   const enterGalaxy = (galaxy) => {
//     setCurrentGalaxy(galaxy);
//     setView('galaxy');
//   };

//   // Animated Starry Background CSS Keyframes (Pure CSS)
//   const StarryBackground = () => (
//     <div className="fixed inset-0 -z-10 overflow-hidden">
//       <div className="absolute inset-0 bg-stars-animation"></div>
//     </div>
//   );

//   // Conditional Rendering of Main Content
//   const renderContent = () => {
//     if (!user) {
//       // User is not logged in, show Auth forms
//       return <Auth onLogin={handleLogin} />;
//     }

//     if (view === 'galaxy' && currentGalaxy) {
//       // Viewing a specific galaxy
//       return (
//         <GalaxyView 
//           user={user} 
//           galaxy={currentGalaxy} 
//           goBack={() => { setView('browser'); setCurrentGalaxy(null); }} 
//         />
//       );
//     }
    
//     if (view === 'leaderboard') {
//       // Viewing the global leaderboard
//       return <Leaderboard />;
//     }
    
//     // Default view: Galaxy Browser
//     return <GalaxyList user={user} onEnterGalaxy={enterGalaxy} />;
//   };

//   return (
//     <div className="min-h-screen font-sans antialiased transition-colors duration-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//       <StarryBackground />
      
//       {/* Header/Navigation Bar */}
//       <header className="sticky top-0 z-50 p-4 border-b border-gray-200 dark:border-gray-800 backdrop-blur-sm bg-opacity-70 dark:bg-opacity-70">
//         <div className="flex items-center justify-between max-w-7xl mx-auto">
//           <h1 
//             className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 cursor-pointer"
//             onClick={() => setView('browser')} // Home button always goes to browser
//           >
//             StormBrainer 🌌
//           </h1>
//           <nav className="flex items-center space-x-4">
//             {user && (
//               <>
//                 {/* View Switchers */}
//                 <button
//                     onClick={() => setView('browser')}
//                     className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${view === 'browser' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
//                 >
//                     Galaxies
//                 </button>
//                 <button
//                     onClick={() => setView('leaderboard')}
//                     className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${view === 'leaderboard' ? 'bg-yellow-500 text-gray-900' : 'text-gray-400 hover:text-white'}`}
//                 >
//                     Leaderboard ⭐
//                 </button>
                
//                 {/* User Info & Logout */}
//                 <span className="hidden sm:inline text-sm text-gray-400">
//                   **{user.username}** (**{user.rating}** ⭐)
//                 </span>
//                 <button 
//                   onClick={handleLogout} 
//                   className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
//                 >
//                   Logout
//                 </button>
//               </>
//             )}
//             {/* Dark/Light Mode Toggle */}
//             <button
//               onClick={() => setDarkMode(!darkMode)}
//               className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
//               title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
//             >
//               {darkMode ? '☀️' : '🌙'}
//             </button>
//           </nav>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto p-4">
//         {renderContent()}
//       </main>
      
//       {/* Global Starry Background Styles (Pure CSS) */}
//       <style global jsx>{`
//         /* ... Starry Background Styles remain unchanged ... */
//         @keyframes twinkle {
//           0% { transform: scale(1); opacity: 0.5; }
//           50% { transform: scale(1.5); opacity: 1; }
//           100% { transform: scale(1); opacity: 0.5; }
//         }

//         .bg-stars-animation {
//           background: transparent;
//           box-shadow: 
//             ${Array.from({ length: 2000 }).map(() => {
//               const x = Math.floor(Math.random() * 100);
//               const y = Math.floor(Math.random() * 100);
//               const size = Math.random() * 2;
//               return `${x}vw ${y}vh #fff, 
//                       ${x}vw ${y}vh 0 ${size}px rgba(255, 255, 255, 0.5)`;
//             }).join(', ')};
          
//           &::before {
//             content: '';
//             position: absolute;
//             top: 0;
//             left: 0;
//             width: 100%;
//             height: 100%;
//             box-shadow: 
//               ${Array.from({ length: 150 }).map(() => {
//                 const x = Math.floor(Math.random() * 100);
//                 const y = Math.floor(Math.random() * 100);
//                 return `${x}vw ${y}vh #fff`;
//               }).join(', ')};
//             animation: twinkle 5s infinite alternate;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default App;