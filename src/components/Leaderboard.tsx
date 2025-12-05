import { useState, useEffect } from 'react';
import { getLeaderboardData, LeaderboardUser } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Trophy, Medal } from 'lucide-react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboardData();
        setLeaderboard(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500 fill-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <span className="text-muted-foreground">{rank}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
        <span className="ml-3 text-muted-foreground">Loading Leaderboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-destructive">
        Error: {error}
      </div>
    );
  }

  return (
    <Card className="bg-card/70 backdrop-blur-md border-yellow-500/30 max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl sm:text-4xl font-extrabold text-center bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent">
          ⭐ Galaxy StormBrainer Leaderboard ⭐
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead className="w-20">Rank</TableHead>
              <TableHead>Username</TableHead>
              <TableHead className="text-right">Rating (Stars)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((user, index) => (
              <TableRow 
                key={user.id} 
                className={index < 3 ? 'bg-yellow-900/10' : ''}
              >
                <TableCell className="font-medium text-center">
                  {getRankIcon(user.rank)}
                </TableCell>
                <TableCell className="text-lg font-semibold">
                  {user.username}
                </TableCell>
                <TableCell className="text-right text-xl font-bold text-yellow-400">
                  {user.rating} ⭐
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {leaderboard.length === 0 && (
          <p className="text-center py-8 text-muted-foreground">
            No users found on the leaderboard yet. Be the first to earn a star!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
