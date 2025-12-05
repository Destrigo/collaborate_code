// frontend/src/hooks/useGalaxy.js

import { useState, useEffect, useCallback } from 'react';
import { getGalaxies, createGalaxy, joinGalaxy } from '../services/api';

/**
 * @description Hook for managing galaxy list, filtering, creation, and joining.
 */
export const useGalaxy = () => {
    const [galaxies, setGalaxies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('public'); // 'public' or 'joined'

    const fetchGalaxies = useCallback(async (currentFilter = filter) => {
        setIsLoading(true);
        setError(null);
        try {
            const list = await getGalaxies(currentFilter);
            setGalaxies(list);
        } catch (err) {
            setError(err.message || 'Failed to load galaxies.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchGalaxies();
    }, [fetchGalaxies]);

    const handleCreateGalaxy = async (galaxyData) => {
        setError(null);
        try {
            const newGalaxy = await createGalaxy(galaxyData);
            // Add the new galaxy to the list and switch to joined filter if applicable
            setGalaxies(prev => [...prev, newGalaxy]); 
            return newGalaxy;
        } catch (err) {
            setError(err.message || 'Failed to create galaxy.');
            throw err;
        }
    };

    const handleJoinGalaxy = async (galaxyId, password) => {
        setError(null);
        try {
            await joinGalaxy(galaxyId, password);
            // Refresh list to update 'is_member' status
            await fetchGalaxies(); 
        } catch (err) {
            setError(err.message || 'Failed to join galaxy.');
            throw err;
        }
    };

    const setFilterAndFetch = (newFilter) => {
        setFilter(newFilter);
        fetchGalaxies(newFilter);
    };

    return {
        galaxies,
        isLoading,
        error,
        filter,
        setFilter: setFilterAndFetch,
        createGalaxy: handleCreateGalaxy,
        joinGalaxy: handleJoinGalaxy,
        refreshGalaxies: fetchGalaxies,
    };
};