import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import GalaxyList from '@/components/galaxy/GalaxyList';
import GalaxyView from '@/components/galaxy/GalaxyView';
import Leaderboard from '@/components/Leaderboard';
import StarryBackground from '@/components/StarryBackground';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut, Star, Sun, Moon, Trophy, Globe } from 'lucide-react';
import { Galaxy } from '@/services/api';
import { Toaster } from '@/components/ui/toaster';

type ViewType = 'browser' | 'galaxy' | 'leaderboard';

const Index = () => {
  const { user, isLoading: authLoading, login, register, logout } = useAuth();
  const [view, setView] = useState<ViewType>('browser');
  const [currentGalaxy, setCurrentGalaxy] = useState<Galaxy | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return saved ? saved === 'dark' : prefersDark;
    }
    return true;
  });

  // Apply dark mode
  if (typeof document !== 'undefined') {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
    setView('browser');
  };

  const handleRegister = async (email: string, password: string, username: string) => {
    await register(email, password, username);
    setView('browser');
  };

  const handleLogout = () => {
    logout();
    setCurrentGalaxy(null);
    setView('browser');
  };

  const enterGalaxy = (galaxy: Galaxy) => {
    setCurrentGalaxy(galaxy);
    setView('galaxy');
  };

  const renderContent = () => {
    if (authLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="animate-spin mr-3 text-purple-500" size={40} />
          <span className="text-xl text-muted-foreground">Checking credentials...</span>
        </div>
      );
    }

    if (view === 'galaxy' && currentGalaxy) {
      return (
        <GalaxyView 
          user={user} 
          galaxy={currentGalaxy} 
          goBack={() => { setView('browser'); setCurrentGalaxy(null); }} 
        />
      );
    }

    if (view === 'leaderboard') {
      return <Leaderboard />;
    }

    return <GalaxyList onEnterGalaxy={enterGalaxy} />;
  };

  return (
    <div className="min-h-screen font-sans antialiased transition-colors duration-500">
      <StarryBackground />
      
      <header className="sticky top-0 z-50 p-4 border-b border-border backdrop-blur-md bg-background/80">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent cursor-pointer"
            onClick={() => setView('browser')}
          >
            StormBrainer 🌌
          </h1>
          <nav className="flex items-center gap-2 sm:gap-4">
            {user && (
              <>
                <Button
                  variant={view === 'browser' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('browser')}
                  className="hidden sm:flex"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Galaxies
                </Button>
                <Button
                  variant={view === 'leaderboard' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('leaderboard')}
                  className={view === 'leaderboard' ? 'bg-yellow-500 hover:bg-yellow-600 text-background' : ''}
                >
                  <Trophy className="sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Leaderboard</span>
                </Button>
                
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border">
                  <span className="text-sm font-medium hidden sm:inline">{user.username}</span>
                  <span className="text-yellow-400 flex items-center text-sm font-bold">
                    {user.rating} <Star size={14} className="ml-0.5 fill-yellow-400" />
                  </span>
                </div>
                
                <Button 
                  variant="destructive"
                  size="icon"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut size={18} />
                </Button>
              </>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        {renderContent()}
      </main>
      
      <Toaster />
    </div>
  );
};

export default Index;
