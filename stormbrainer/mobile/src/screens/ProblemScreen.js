import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, TextInput, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { useAuth } from '../../App';
import { getProblemsForGalaxy, getSolutionsForProblem, createSolution, rateSolution } from '../services/api';
import Icon from 'react-native-vector-icons/FontAwesome'; // Assumes FontAwesome is available

const PRIMARY_COLOR = '#a78bfa'; // Violet
const BACKGROUND_COLOR = '#0f172a'; // Slate-900
const CARD_COLOR = '#1e293b'; // Slate-800

// --- Sub Component: Problem List Item ---
const ProblemListItem = ({ problem, onSelect, isSelected }) => (
    <TouchableOpacity 
        style={[styles.problemListItem, isSelected && styles.problemListItemSelected]}
        onPress={() => onSelect(problem)}
    >
        <Text style={styles.problemListItemTitle} numberOfLines={1}>
            {problem.title}
        </Text>
        <Text style={styles.problemListItemStats}>
            {problem.solution_count} Solutions | {problem.stars} {Icon.getImageSource('star', 12, '#facc15')}
        </Text>
    </TouchableOpacity>
);

// --- Sub Component: Solution Card ---
const SolutionCardMobile = ({ solution, onRatingChange }) => {
    const { user, updateRating } = useAuth();
    const [stars, setStars] = useState(solution.stars);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isAuthor = user.id === solution.author_id;

    const handleRate = async (value) => {
        if (isAuthor || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await rateSolution(solution.id, value);
            setStars(stars + value);
            updateRating(user.rating + value);
            onRatingChange();
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Failed to submit rating.";
            Alert.alert('Rating Error', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={[styles.solutionCard, isAuthor && styles.solutionCardAuthor]}>
            <View style={styles.solutionHeader}>
                <Text style={styles.solutionAuthor}>Author: {solution.author_name}</Text>
                <View style={styles.solutionStarContainer}>
                    <Text style={styles.solutionStars}>{stars}</Text>
                    <Icon name="star" size={18} color="#facc15" />
                </View>
            </View>
            <Text style={styles.solutionText}>{solution.text}</Text>
            
            <View style={styles.solutionFooter}>
                {!isAuthor && (
                    <View style={styles.ratingControls}>
                        <TouchableOpacity
                            onPress={() => handleRate(1)}
                            disabled={isSubmitting}
                            style={[styles.rateButton, { backgroundColor: '#34d399' }]} // Green
                        >
                            <Icon name="arrow-up" size={14} color="#000" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleRate(-1)}
                            disabled={isSubmitting}
                            style={[styles.rateButton, { backgroundColor: '#ef4444' }]} // Red
                        >
                            <Icon name="arrow-down" size={14} color="#000" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

// --- Sub Component: Solution Submission Form ---
const SolutionFormMobile = ({ problemId, onSolutionSuccess }) => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (text.trim().length < 50) {
            return Alert.alert('Validation Error', 'Solution must be at least 50 characters long.');
        }

        setLoading(true);
        try {
            const newSolution = await createSolution(problemId, text);
            onSolutionSuccess(newSolution);
            setText('');
            Alert.alert('Success', 'Solution posted successfully!');
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to post solution.';
            Alert.alert('Submission Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Submit Your Solution</Text>
            <TextInput
                style={styles.solutionInput}
                placeholder="Type your detailed solution here (min 50 chars)..."
                placeholderTextColor="#64748b"
                value={text}
                onChangeText={setText}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
            />
            <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            >
                {loading ? (
                    <ActivityIndicator color="#0f172a" />
                ) : (
                    <Text style={styles.submitButtonText}>Post Solution</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};


// --- Main Problem Screen ---

const ProblemScreen = ({ route }) => {
    const { galaxyId, galaxyName } = route.params;
    const [problems, setProblems] = useState([]);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [solutions, setSolutions] = useState([]);
    const [loadingProblems, setLoadingProblems] = useState(true);
    const [loadingSolutions, setLoadingSolutions] = useState(false);
    
    // --- Data Fetching Logic ---
    const fetchProblems = useCallback(async () => {
        setLoadingProblems(true);
        try {
            const data = await getProblemsForGalaxy(galaxyId);
            setProblems(data);
            if (data.length > 0 && !selectedProblem) {
                // Auto-select the first problem if none is selected
                setSelectedProblem(data[0]);
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to load problems for this galaxy.');
        } finally {
            setLoadingProblems(false);
        }
    }, [galaxyId, selectedProblem]);

    const fetchSolutions = useCallback(async (problemId) => {
        setLoadingSolutions(true);
        try {
            const data = await getSolutionsForProblem(problemId);
            // Sort by stars descending for display
            setSolutions(data.sort((a, b) => b.stars - a.stars));
        } catch (err) {
            Alert.alert('Error', 'Failed to load solutions.');
            setSolutions([]);
        } finally {
            setLoadingSolutions(false);
        }
    }, []);

    useEffect(() => {
        fetchProblems();
    }, [fetchProblems]);

    useEffect(() => {
        if (selectedProblem) {
            // Update the screen header with the selected problem's title
            navigation.setOptions({ title: selectedProblem.title });
            fetchSolutions(selectedProblem.id);
        }
    }, [selectedProblem, fetchSolutions, navigation]);
    
    // --- Handlers ---
    const handleSelectProblem = (problem) => {
        // Clear solutions and set new problem
        setSolutions([]); 
        setSelectedProblem(problem);
    };

    const handleNewSolution = (newSolution) => {
        // Add new solution and re-sort
        setSolutions(prev => [newSolution, ...prev].sort((a, b) => b.stars - a.stars));
    };

    if (loadingProblems && !problems.length) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                <Text style={styles.loadingText}>Loading problems for {galaxyName}...</Text>
            </View>
        );
    }
    
    return (
        <KeyboardAvoidingView 
            style={styles.fullScreenContainer} 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.problemsHeader}>
                <Text style={styles.problemsHeaderText}>{galaxyName} Problems</Text>
            </View>

            {/* Top Bar for Problem Selection (Horizontal Scroll) */}
            <View style={styles.problemListContainer}>
                <FlatList
                    data={problems}
                    renderItem={({ item }) => (
                        <ProblemListItem
                            problem={item}
                            onSelect={handleSelectProblem}
                            isSelected={selectedProblem && selectedProblem.id === item.id}
                        />
                    )}
                    keyExtractor={item => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.problemList}
                />
            </View>
            
            {/* Main Content Area (ScrollView for Problem Detail, Solutions, and Form) */}
            <ScrollView style={styles.contentArea}>
                {selectedProblem && (
                    <View style={styles.problemCard}>
                        <Text style={styles.problemTitle}>{selectedProblem.title}</Text>
                        <Text style={styles.problemDescription}>{selectedProblem.description}</Text>
                        <View style={styles.problemFooter}>
                            <Text style={styles.problemCreator}>
                                Creator: {selectedProblem.creator_name}
                            </Text>
                            <Text style={styles.problemStars}>
                                {selectedProblem.stars} <Icon name="star" size={14} color="#facc15" />
                            </Text>
                        </View>
                    </View>
                )}

                {/* Solutions Section */}
                <View style={styles.solutionsSection}>
                    <Text style={styles.solutionsTitle}>Solutions ({solutions.length})</Text>
                    {loadingSolutions && <ActivityIndicator size="small" color="#fff" style={{marginVertical: 10}} />}
                    
                    {!loadingSolutions && solutions.length === 0 ? (
                        <Text style={styles.noSolutionsText}>Be the first to post a solution!</Text>
                    ) : (
                        solutions.map(solution => (
                            <SolutionCardMobile 
                                key={solution.id} 
                                solution={solution} 
                                // Re-fetch solutions to re-sort after a vote
                                onRatingChange={() => fetchSolutions(selectedProblem.id)}
                            />
                        ))
                    )}
                </View>
                
                {selectedProblem && (
                    <SolutionFormMobile 
                        problemId={selectedProblem.id}
                        onSolutionSuccess={handleNewSolution}
                    />
                )}
                <View style={{height: 50}} /> 
            </ScrollView>
        </KeyboardAvoidingView>
    );
};


const styles = StyleSheet.create({
    fullScreenContainer: {
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
    problemsHeader: {
        padding: 10,
        backgroundColor: CARD_COLOR,
        borderBottomWidth: 1,
        borderBottomColor: PRIMARY_COLOR,
        alignItems: 'center',
    },
    problemsHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
    },
    problemListContainer: {
        paddingVertical: 10,
        backgroundColor: CARD_COLOR,
    },
    problemList: {
        paddingHorizontal: 10,
    },
    problemListItem: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        marginHorizontal: 5,
        borderRadius: 20,
        backgroundColor: '#334155', // Slate-700
    },
    problemListItemSelected: {
        backgroundColor: PRIMARY_COLOR,
        borderWidth: 1,
        borderColor: '#fff',
    },
    problemListItemTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    problemListItemStats: {
        fontSize: 10,
        color: '#ccc',
    },
    contentArea: {
        flex: 1,
        padding: 15,
    },
    problemCard: {
        backgroundColor: CARD_COLOR,
        padding: 15,
        borderRadius: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#38bdf8', // Sky-400
        marginBottom: 20,
    },
    problemTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    problemDescription: {
        fontSize: 14,
        color: '#e2e8f0', // Slate-200
        marginBottom: 10,
    },
    problemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#334155',
        paddingTop: 8,
        marginTop: 5,
    },
    problemCreator: {
        fontSize: 12,
        color: '#94a3b8',
    },
    problemStars: {
        fontSize: 14,
        color: '#facc15',
        fontWeight: 'bold',
    },
    solutionsSection: {
        marginBottom: 20,
    },
    solutionsTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    noSolutionsText: {
        color: '#94a3b8',
        textAlign: 'center',
        paddingVertical: 15,
    },
    solutionCard: {
        backgroundColor: CARD_COLOR,
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#334155',
    },
    solutionCardAuthor: {
        borderColor: '#8b5cf6', // Violet-500 for author's own solution
    },
    solutionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    solutionAuthor: {
        fontSize: 12,
        color: '#94a3b8',
    },
    solutionStarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    solutionStars: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#facc15',
        marginRight: 4,
    },
    solutionText: {
        color: '#e2e8f0',
        fontSize: 14,
        marginBottom: 10,
    },
    solutionFooter: {
        alignItems: 'flex-end',
    },
    ratingControls: {
        flexDirection: 'row',
        gap: 8,
    },
    rateButton: {
        padding: 8,
        borderRadius: 50,
    },
    formContainer: {
        backgroundColor: CARD_COLOR,
        padding: 15,
        borderRadius: 10,
        borderTopWidth: 2,
        borderTopColor: '#34d399', // Emerald-400
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#34d399',
        marginBottom: 10,
    },
    solutionInput: {
        height: 100,
        backgroundColor: BACKGROUND_COLOR,
        color: '#fff',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#334155',
    },
    submitButton: {
        backgroundColor: '#34d399',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#475569',
    },
    submitButtonText: {
        color: BACKGROUND_COLOR,
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ProblemScreen;