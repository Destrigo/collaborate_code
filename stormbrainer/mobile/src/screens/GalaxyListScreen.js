import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView, RefreshControl } from 'react-native';
import { useAuth } from '../../App';
import { getGalaxies } from '../services/api';

const PRIMARY_COLOR = '#a78bfa'; // Tailwind violet-400
const BACKGROUND_COLOR = '#0f172a'; // Tailwind slate-900

const GalaxyListScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [galaxies, setGalaxies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchGalaxies = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const data = await getGalaxies();
      setGalaxies(data);
    } catch (err) {
      setError('Failed to load galaxies. Check your network or API connection.');
    } finally {
      setIsRefreshing(false);
      if (isLoading) setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    fetchGalaxies();
  }, [fetchGalaxies]);

  const handleSelectGalaxy = (galaxy) => {
    // Navigate to the ProblemScreen, passing the entire galaxy object
    navigation.navigate('Problem', { 
        galaxyId: galaxy.id,
        galaxyName: galaxy.name,
        // Optional: you might want a specific ProblemListScreen here, 
        // but for simplicity, we jump straight to problems list/view logic
    });
  };

  const renderGalaxyCard = ({ item: galaxy }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => handleSelectGalaxy(galaxy)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.galaxyName}>{galaxy.name}</Text>
        <Text style={styles.category}>{galaxy.category}</Text>
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {galaxy.description}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={styles.stats}>
          👤 {galaxy.member_count} Members 
        </Text>
        <Text style={[styles.stats, galaxy.is_member ? styles.memberStatus : styles.nonMemberStatus]}>
          {galaxy.is_member ? 'Member' : (galaxy.is_public ? 'Public' : 'Private')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading && !isRefreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={styles.loadingText}>Charting the cosmos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome, {user?.username}!</Text>
        <Text style={styles.ratingText}>Rating: {user?.rating} ⭐</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      {galaxies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No galaxies found.</Text>
          <Text style={styles.emptySubText}>Pull down to refresh or create a new galaxy.</Text>
        </View>
      ) : (
        <FlatList
          data={galaxies}
          renderItem={renderGalaxyCard}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={fetchGalaxies} tintColor={PRIMARY_COLOR} />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
  },
  loadingText: {
    color: PRIMARY_COLOR,
    marginTop: 10,
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  ratingText: {
    fontSize: 16,
    color: '#facc15', // Tailwind yellow-400
  },
  logoutButton: {
    padding: 5,
  },
  logoutText: {
    color: '#dc2626', // Tailwind red-600
    fontSize: 14,
  },
  listContent: {
    padding: 10,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: PRIMARY_COLOR,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  galaxyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flexShrink: 1,
    paddingRight: 10,
  },
  category: {
    fontSize: 14,
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stats: {
    fontSize: 12,
    color: '#94a3b8',
  },
  memberStatus: {
    color: '#34d399', // Tailwind emerald-400
    fontWeight: 'bold',
  },
  nonMemberStatus: {
    color: '#fbbf24', // Tailwind amber-400
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    color: '#94a3b8',
    marginBottom: 5,
  },
  emptySubText: {
    fontSize: 14,
    color: '#64748b',
  }
});

export default GalaxyListScreen;