import { useState } from 'react';
import { useGalaxy } from '@/hooks/useGalaxy';
import { getCategories, Galaxy } from '@/services/api';
import GalaxyCard from './GalaxyCard';
import CreateGalaxyModal from './CreateGalaxyModal';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus } from 'lucide-react';

interface GalaxyListProps {
  onEnterGalaxy: (galaxy: Galaxy) => void;
}

const GalaxyList = ({ onEnterGalaxy }: GalaxyListProps) => {
  const { galaxies, isLoading, filter, setFilter, createGalaxy, joinGalaxy } = useGalaxy();
  const categories = getCategories();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [joinPassword, setJoinPassword] = useState('');
  const [joiningGalaxy, setJoiningGalaxy] = useState<Galaxy | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredGalaxies = galaxies.filter(g => 
    categoryFilter === 'All' || g.category === categoryFilter
  );

  const handleJoinClick = (galaxy: Galaxy) => {
    if (galaxy.is_public) {
      joinGalaxy(galaxy.id).then(() => {
        onEnterGalaxy(galaxy);
      }).catch(err => alert(err.message));
    } else {
      setJoiningGalaxy(galaxy);
    }
  };

  const submitJoinPassword = async () => {
    if (!joiningGalaxy) return;
    try {
      await joinGalaxy(joiningGalaxy.id, joinPassword);
      onEnterGalaxy(joiningGalaxy);
      setJoiningGalaxy(null);
      setJoinPassword('');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to join');
    }
  };

  const handleCreateSuccess = async (data: {
    name: string;
    description: string;
    category: string;
    is_public: boolean;
    password?: string;
  }) => {
    const newGalaxy = await createGalaxy(data);
    onEnterGalaxy(newGalaxy);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border">
        <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
          Galaxies Available
        </h2>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Galaxy
        </Button>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          <Button
            variant={filter === 'public' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('public')}
          >
            Public Browsing
          </Button>
          <Button
            variant={filter === 'joined' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('joined')}
          >
            My Joined Galaxies
          </Button>
        </div>

        {filter === 'public' && (
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] bg-background/50">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Galaxy Grid */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <span className="ml-3 text-muted-foreground">Loading Galaxies...</span>
        </div>
      )}
      
      {!isLoading && filteredGalaxies.length === 0 && (
        <p className="text-center text-muted-foreground py-10">
          {filter === 'joined' 
            ? 'You have not joined any galaxies yet. Find one in the Public Browsing tab!' 
            : 'No public galaxies found in this category.'}
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
        onCreateSuccess={handleCreateSuccess}
      />

      <Dialog open={!!joiningGalaxy} onOpenChange={() => setJoiningGalaxy(null)}>
        <DialogContent className="bg-card border-purple-500/30">
          <DialogHeader>
            <DialogTitle>Join Private Galaxy: {joiningGalaxy?.name}</DialogTitle>
            <DialogDescription>
              This galaxy requires a secret access code.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Galaxy Access Code"
              value={joinPassword}
              onChange={(e) => setJoinPassword(e.target.value)}
              className="bg-background/50"
            />
            <Button
              onClick={submitJoinPassword}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600"
            >
              Authenticate & Join
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalaxyList;
