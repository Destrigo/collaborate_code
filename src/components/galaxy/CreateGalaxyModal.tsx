import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getCategories } from '@/services/api';
import { Loader2 } from 'lucide-react';

interface CreateGalaxyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSuccess: (data: {
    name: string;
    description: string;
    category: string;
    is_public: boolean;
    password?: string;
  }) => Promise<void>;
}

const CreateGalaxyModal = ({ isOpen, onClose, onCreateSuccess }: CreateGalaxyModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = getCategories();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await onCreateSuccess({
        name,
        description,
        category,
        is_public: isPublic,
        password: !isPublic ? password : undefined,
      });
      // Reset form
      setName('');
      setDescription('');
      setCategory('');
      setIsPublic(true);
      setPassword('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create galaxy');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Create New Galaxy
          </DialogTitle>
          <DialogDescription>
            Launch your own brainstorming space
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Galaxy Name</Label>
            <Input
              id="name"
              placeholder="Enter galaxy name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-background/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What's this galaxy about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-background/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="isPublic">Public Galaxy</Label>
            <Switch
              id="isPublic"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
          
          {!isPublic && (
            <div className="space-y-2">
              <Label htmlFor="password">Access Code</Label>
              <Input
                id="password"
                type="password"
                placeholder="Secret access code"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>
          )}
          
          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Launch Galaxy 🌌'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGalaxyModal;
