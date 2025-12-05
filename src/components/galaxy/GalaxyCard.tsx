import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Galaxy } from '@/services/api';
import { Rocket, LogIn } from 'lucide-react';

interface GalaxyCardProps {
  galaxy: Galaxy;
  onJoin: (galaxy: Galaxy) => void;
  onEnter: (galaxy: Galaxy) => void;
}

const GalaxyCard = ({ galaxy, onJoin, onEnter }: GalaxyCardProps) => {
  return (
    <Card className="bg-card/70 backdrop-blur-md border-purple-600/30 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-semibold text-purple-400 truncate">
            {galaxy.name}
          </CardTitle>
          <Badge variant={galaxy.is_public ? "default" : "destructive"} className={galaxy.is_public ? "bg-green-600/20 text-green-400 border-green-500/30" : "bg-red-600/20 text-red-400 border-red-500/30"}>
            {galaxy.is_public ? 'Public' : 'Private'}
          </Badge>
        </div>
        <CardDescription>
          Owner: <span className="font-medium">{galaxy.owner_username}</span> | Category: <span className="font-medium">{galaxy.category}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2 mb-4">
          {galaxy.description || 'No description provided.'}
        </p>
        
        {galaxy.is_member ? (
          <Button 
            onClick={() => onEnter(galaxy)}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            <Rocket className="mr-2 h-4 w-4" />
            Enter Galaxy
          </Button>
        ) : (
          <Button 
            onClick={() => onJoin(galaxy)}
            variant="outline"
            className="w-full border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Join
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default GalaxyCard;
