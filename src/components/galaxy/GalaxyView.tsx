import { useState, useEffect } from 'react';
import { getProblems, createProblem, getSolutions, createSolution, rateSolution, Galaxy, Problem, Solution, User } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Star, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GalaxyViewProps {
  user: User;
  galaxy: Galaxy;
  goBack: () => void;
}

const getPlanetSizeClass = (stars: number) => {
  if (stars >= 50) return 'w-28 h-28 text-lg';
  if (stars >= 20) return 'w-20 h-20 text-base';
  if (stars >= 5) return 'w-16 h-16 text-sm';
  if (stars >= 1) return 'w-12 h-12 text-xs';
  return 'w-10 h-10 text-xs';
};

interface PlanetProps {
  item: Problem | Solution;
  type: 'problem' | 'solution';
  onClick: () => void;
}

const Planet = ({ item, type, onClick }: PlanetProps) => {
  const stars = 'stars' in item ? item.stars || 0 : 0;
  const sizeClass = getPlanetSizeClass(stars);
  const colorClass = type === 'problem' 
    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/50' 
    : 'bg-gradient-to-br from-teal-400 to-cyan-600 shadow-teal-400/50';

  return (
    <div 
      className={`relative rounded-full ${sizeClass} ${colorClass} flex items-center justify-center p-2 text-white font-bold cursor-pointer transition-all duration-300 transform hover:scale-110 shadow-xl ring-2 ring-white/20 group`}
      onClick={onClick}
    >
      <span className="truncate max-w-full p-1 text-center pointer-events-none">
        {type === 'problem' ? (item as Problem).title.slice(0, 8) : `${stars} ⭐`}
      </span>
      
      <div className="absolute top-full mt-2 hidden group-hover:block z-50 p-3 bg-popover rounded-lg shadow-2xl text-popover-foreground text-sm w-64 text-left border border-border">
        <h4 className="font-bold mb-1">
          {'title' in item ? item.title : `Solution by ${(item as Solution).author_username}`}
        </h4>
        <p className="text-muted-foreground line-clamp-3">
          {'description' in item ? item.description : (item as Solution).text}
        </p>
        <p className="mt-2 text-yellow-400">Rating: {stars} ⭐</p>
      </div>
    </div>
  );
};

const GalaxyView = ({ user, galaxy, goBack }: GalaxyViewProps) => {
  const { toast } = useToast();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [newProblem, setNewProblem] = useState({ title: '', description: '' });
  const [newSolution, setNewSolution] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProblems = async () => {
      setIsLoading(true);
      try {
        const p = await getProblems(galaxy.id);
        setProblems(p);
      } catch (err) {
        toast({ variant: "destructive", title: "Error", description: `Failed to load problems: ${err instanceof Error ? err.message : 'Unknown error'}` });
      } finally {
        setIsLoading(false);
      }
    };
    loadProblems();
  }, [galaxy.id, toast]);

  const loadSolutions = async (problemId: number) => {
    try {
      const s = await getSolutions(problemId);
      setSolutions(s);
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: `Failed to load solutions: ${err instanceof Error ? err.message : 'Unknown error'}` });
    }
  };

  const handleViewProblem = async (problem: Problem) => {
    setCurrentProblem(problem);
    await loadSolutions(problem.id);
  };

  const handleCloseProblemView = () => {
    setCurrentProblem(null);
    setSolutions([]);
  };

  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await createProblem(galaxy.id, newProblem.title, newProblem.description);
      setProblems([...problems, created]);
      setIsProblemModalOpen(false);
      setNewProblem({ title: '', description: '' });
      toast({ title: "Success", description: "Problem planet created!" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: `Error creating problem: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  };

  const handleCreateSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProblem) return;

    try {
      const created = await createSolution(currentProblem.id, newSolution);
      setSolutions([...solutions, created]);
      setIsSolutionModalOpen(false);
      setNewSolution('');
      toast({ title: "Success", description: "Solution launched!" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: `Error submitting solution: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  };

  const handleRateSolution = async (solutionId: number) => {
    try {
      const updatedSolution = await rateSolution(solutionId, 1);
      setSolutions(solutions.map(s => s.id === solutionId ? updatedSolution : s));
      toast({ title: "⭐ Star given!", description: `Solution received a star!` });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: `Error rating solution: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  };

  const renderProblemPlanets = () => (
    <Card className="bg-card/50 backdrop-blur-md border-border/50 min-h-[400px]">
      <CardHeader>
        <CardTitle className="text-muted-foreground">Problems (Click a Planet to View Solutions)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : problems.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">
            No problems in this galaxy yet. {user.id === galaxy.owner_id ? 'Start by creating one!' : 'Wait for the owner to post!'}
          </p>
        ) : (
          <div className="flex flex-wrap justify-center items-center gap-6 py-8">
            {problems.map(p => (
              <Planet 
                key={p.id}
                item={p} 
                type="problem" 
                onClick={() => handleViewProblem(p)} 
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderProblemDetails = () => (
    <Card className="bg-card/70 backdrop-blur-md border-indigo-500/30">
      <CardHeader className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCloseProblemView}
          className="absolute top-4 right-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <CardTitle className="text-3xl text-indigo-400">{currentProblem?.title}</CardTitle>
        <p className="text-muted-foreground border-b border-border pb-4">
          {currentProblem?.description}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="text-xl font-bold text-teal-400">
            Solutions ({solutions.length} Planets)
          </h4>
          <Button
            onClick={() => setIsSolutionModalOpen(true)}
            className="bg-gradient-to-r from-teal-500 to-cyan-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Submit a Solution
          </Button>
        </div>

        <div className="flex flex-wrap gap-8 justify-center items-center min-h-[200px] p-4 bg-background/30 rounded-xl">
          {solutions.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No one has proposed a solution yet. Be the first!
            </p>
          ) : (
            solutions.map(s => (
              <div key={s.id} className="relative group">
                <Planet 
                  item={s} 
                  type="solution" 
                  onClick={() => toast({ title: `Solution by ${s.author_username}`, description: s.text })}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRateSolution(s.id)}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-yellow-400 hover:text-yellow-300"
                >
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  Star
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border">
        <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-300 to-pink-500 bg-clip-text text-transparent">
          Galaxy: {galaxy.name}
        </h2>
        <div className="flex items-center gap-3">
          {user.id === galaxy.owner_id && (
            <Button
              onClick={() => setIsProblemModalOpen(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Problem
            </Button>
          )}
          <Button variant="outline" onClick={goBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Browser
          </Button>
        </div>
      </header>

      {currentProblem ? renderProblemDetails() : renderProblemPlanets()}

      {/* Create Problem Modal */}
      <Dialog open={isProblemModalOpen} onOpenChange={setIsProblemModalOpen}>
        <DialogContent className="bg-card border-purple-500/30">
          <DialogHeader>
            <DialogTitle>Create a New Problem Planet</DialogTitle>
            <DialogDescription>Define a challenge for the community</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateProblem} className="space-y-4">
            <Input
              placeholder="Problem Title"
              value={newProblem.title}
              onChange={(e) => setNewProblem({...newProblem, title: e.target.value})}
              required
              className="bg-background/50"
            />
            <Textarea
              placeholder="Detailed Problem Description..."
              value={newProblem.description}
              onChange={(e) => setNewProblem({...newProblem, description: e.target.value})}
              rows={5}
              required
              className="bg-background/50"
            />
            <Button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600">
              Launch Problem Planet
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Submit Solution Modal */}
      <Dialog open={isSolutionModalOpen} onOpenChange={setIsSolutionModalOpen}>
        <DialogContent className="bg-card border-teal-500/30">
          <DialogHeader>
            <DialogTitle>Submit Solution for: {currentProblem?.title}</DialogTitle>
            <DialogDescription>Share your brilliant idea</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSolution} className="space-y-4">
            <Textarea
              placeholder="Your detailed solution..."
              value={newSolution}
              onChange={(e) => setNewSolution(e.target.value)}
              rows={6}
              required
              className="bg-background/50"
            />
            <Button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-cyan-600">
              Launch Solution Planet
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalaxyView;
