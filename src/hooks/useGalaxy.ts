import { useState, useEffect, useCallback } from 'react';
import { getGalaxies, createGalaxy as apiCreateGalaxy, joinGalaxy as apiJoinGalaxy, Galaxy } from '../services/api';

export const useGalaxy = () => {
  const [galaxies, setGalaxies] = useState<Galaxy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilterState] = useState<'public' | 'joined'>('public');

  const fetchGalaxies = useCallback(async (currentFilter: string = filter) => {
    setIsLoading(true);
    setError(null);
    try {
      const list = await getGalaxies(currentFilter);
      setGalaxies(list);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load galaxies.';
      setError(message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchGalaxies();
  }, [fetchGalaxies]);

  const handleCreateGalaxy = async (galaxyData: {
    name: string;
    description: string;
    category: string;
    is_public: boolean;
    password?: string;
  }) => {
    setError(null);
    try {
      const newGalaxy = await apiCreateGalaxy(galaxyData);
      setGalaxies(prev => [...prev, newGalaxy]);
      return newGalaxy;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create galaxy.';
      setError(message);
      throw err;
    }
  };

  const handleJoinGalaxy = async (galaxyId: number, password?: string) => {
    setError(null);
    try {
      await apiJoinGalaxy(galaxyId, password);
      await fetchGalaxies();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to join galaxy.';
      setError(message);
      throw err;
    }
  };

  const setFilter = (newFilter: 'public' | 'joined') => {
    setFilterState(newFilter);
    fetchGalaxies(newFilter);
  };

  return {
    galaxies,
    isLoading,
    error,
    filter,
    setFilter,
    createGalaxy: handleCreateGalaxy,
    joinGalaxy: handleJoinGalaxy,
    refreshGalaxies: fetchGalaxies,
  };
};
