// frontend/src/components/galaxy/GalaxyView.jsx

import React, { useState, useEffect } from 'react';
import { 
    getProblems, 
    createProblem, 
    getSolutions, 
    createSolution, 
    rateSolution 
} from '../../services/api';
// Assuming Modal component exists in common
import Modal from '../common/Modal'; 

// --- Helper Components for Visualization ---

// Function to determine planet size based on rating (stars)
const getPlanetSizeClass = (stars) => {
    if (stars >= 50) return 'w-28 h-28 text-3xl'; // Supergiant
    if (stars >= 20) return 'w-20 h-20 text-2xl'; // Giant
    if (stars >= 5) return 'w-14 h-14 text-xl';   // Large
    if (stars >= 1) return 'w-10 h-10 text-lg';   // Medium
    return 'w-8 h-8 text-base';                    // Small
};

// Component for the "Planet" Visualization (Problem or Solution)
const Planet = ({ item, type, onClick }) => {
    const sizeClass = getPlanetSizeClass(item.stars || 0); // Use 0 for problems if they don't have stars yet
    const color = type === 'problem' ? 'bg-indigo-600' : 'bg-teal-500';
    const shadow = type === 'problem' ? 'shadow-indigo-500/50' : 'shadow-teal-400/50';

    return (
        <div 
            className={`relative rounded-full ${sizeClass} ${color} flex items-center justify-center p-2 text-white font-bold cursor-pointer transition-all duration-500 transform hover:scale-110 shadow-xl ${shadow} ring-4 ring-white/10 group`}
            onClick={onClick}
        >
            <span className="truncate max-w-full p-1 text-center text-xs pointer-events-none">
                {type === 'problem' ? item.title : `${item.stars} ⭐`}
            </span>
            
            {/* Tooltip on Hover */}
            <div className="absolute top-full mt-2 hidden group-hover:block z-50 p-3 bg-gray-800 rounded-lg shadow-2xl text-white text-sm whitespace-pre-wrap w-64 text-left">
                <h4 className="font-bold mb-1">{item.title || `Solution by ${item.author_username}`}</h4>
                <p className="text-gray-300 line-clamp-3">{item.description || item.text}</p>
                <p className="mt-2 text-yellow-400">Rating: **{item.stars || 0}** ⭐</p>
            </div>
        </div>
    );
};


// --- Main Component ---

const GalaxyView = ({ user, galaxy, goBack }) => {
    const [problems, setProblems] = useState([]);
    const [solutions, setSolutions] = useState([]);
    const [currentProblem, setCurrentProblem] = useState(null);
    const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
    const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
    const [newProblem, setNewProblem] = useState({ title: '', description: '' });
    const [newSolution, setNewSolution] = useState('');

    // Fetch all problems when galaxy changes
    useEffect(() => {
        const loadProblems = async () => {
            try {
                const p = await getProblems(galaxy.id);
                setProblems(p);
            } catch (err) {
                alert(`Failed to load problems: ${err.message}`);
            }
        };
        loadProblems();
    }, [galaxy.id]);

    // Load solutions for a selected problem
    const loadSolutions = async (problemId) => {
        try {
            const s = await getSolutions(problemId);
            setSolutions(s);
        } catch (err) {
            alert(`Failed to load solutions: ${err.message}`);
        }
    };

    // Open Problem Detail/Solutions View
    const handleViewProblem = async (problem) => {
        setCurrentProblem(problem);
        await loadSolutions(problem.id);
    };
    
    // Close Problem Detail View
    const handleCloseProblemView = () => {
        setCurrentProblem(null);
        setSolutions([]);
    };

    // Create New Problem (Owner only)
    const handleCreateProblem = async (e) => {
        e.preventDefault();
        try {
            const created = await createProblem(galaxy.id, newProblem.title, newProblem.description);
            setProblems([...problems, created]);
            setIsProblemModalOpen(false);
            setNewProblem({ title: '', description: '' });
        } catch (error) {
            alert(`Error creating problem: ${error.message}`);
        }
    };

    // Create New Solution
    const handleCreateSolution = async (e) => {
        e.preventDefault();
        if (!currentProblem) return;

        try {
            const created = await createSolution(currentProblem.id, newSolution);
            setSolutions([...solutions, created]);
            setIsSolutionModalOpen(false);
            setNewSolution('');
        } catch (error) {
            alert(`Error submitting solution: ${error.message}`);
        }
    };
    
    // Handle Rating a Solution (Star)
    const handleRateSolution = async (solutionId) => {
        try {
            const updatedSolution = await rateSolution(solutionId, 1); // Value 1 for star
            
            // Update the solution list
            setSolutions(solutions.map(s => 
                s.id === solutionId ? updatedSolution : s
            ));
            
            // Optionally, refresh user data to show updated global rating
            // Refreshing the whole app state would be better here, but we keep it simple.
            alert(`Solution by ${updatedSolution.author_username} received a star!`);
        } catch (error) {
            alert(`Error rating solution: ${error.message}`);
        }
    };
    
    // --- Rendering Functions ---
    
    const renderProblemPlanets = () => (
        <div className="relative flex flex-wrap justify-around items-center min-h-[500px] border border-gray-700/50 rounded-xl p-8 bg-gray-900/50 backdrop-blur-sm">
            <h3 className="absolute top-4 left-4 text-xl font-bold text-white/70">
                **Problems** (Click a Planet to View Solutions)
            </h3>
            {problems.length === 0 && (
                <p className="text-center text-gray-500">
                    No problems in this galaxy yet. {user.id === galaxy.owner_id ? 'Start by creating one!' : 'Wait for the owner to post!'}
                </p>
            )}
            {problems.map(p => (
                <div key={p.id} className="m-4">
                    <Planet 
                        item={p} 
                        type="problem" 
                        onClick={() => handleViewProblem(p)} 
                    />
                </div>
            ))}
        </div>
    );
    
    const renderProblemDetails = () => (
        <div className="relative p-6 bg-gray-800 rounded-xl shadow-2xl border border-indigo-500/50">
            <button 
                onClick={handleCloseProblemView} 
                className="absolute top-4 right-4 p-2 bg-gray-700 rounded-full hover:bg-gray-600 text-white z-20"
                title="Back to Problems"
            >
                &#8592;
            </button>
            
            <h3 className="text-4xl font-extrabold text-indigo-400 mb-2">{currentProblem.title}</h3>
            <p className="text-lg text-gray-300 mb-6 border-b border-gray-700 pb-4">
                {currentProblem.description}
            </p>

            {/* Solutions Section */}
            <div className="space-y-8">
                <header className="flex justify-between items-center">
                    <h4 className="text-2xl font-bold text-teal-400">
                        **Solutions** ({solutions.length} Planets)
                    </h4>
                    <button
                        onClick={() => setIsSolutionModalOpen(true)}
                        className="px-4 py-2 text-white bg-teal-500 rounded-lg shadow-md hover:bg-teal-600 transition-colors"
                    >
                        Submit a Solution
                    </button>
                </header>

                {/* Solutions Visualization */}
                <div className="flex flex-wrap gap-8 justify-center items-center min-h-[200px] p-4 bg-gray-900/50 rounded-xl">
                    {solutions.length === 0 ? (
                        <p className="text-center text-gray-500">
                            No one has proposed a solution yet. Be the first!
                        </p>
                    ) : (
                        solutions.map(s => (
                            <div key={s.id} className="relative group">
                                <Planet 
                                    item={s} 
                                    type="solution" 
                                    onClick={() => alert(`Solution by ${s.author_username}:\n\n${s.text}\n\nRating: ${s.stars} ⭐`)}
                                />
                                <div className="absolute top-full -left-1/2 mt-2 w-20 p-1 bg-gray-700 rounded-lg shadow-xl text-xs flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleRateSolution(s.id)}
                                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                                        title="Give a Star"
                                    >
                                        ⭐ Star
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            
            {/* Submit Solution Modal */}
            <Modal 
                isOpen={isSolutionModalOpen} 
                onClose={() => setIsSolutionModalOpen(false)} 
                title={`Submit Solution for: ${currentProblem.title}`}
            >
                <form onSubmit={handleCreateSolution} className="space-y-4">
                    <textarea
                        placeholder="Your detailed solution..."
                        value={newSolution}
                        onChange={(e) => setNewSolution(e.target.value)}
                        rows="6"
                        required
                        className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                    ></textarea>
                    <button
                        type="submit"
                        className="w-full p-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors"
                    >
                        Launch Solution Planet
                    </button>
                </form>
            </Modal>
        </div>
    );

    // --- Main Render ---

    return (
        <div className="space-y-8">
            <header className="pb-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-500">
                    Viewing Galaxy: **{galaxy.name}**
                </h2>
                <div className='flex items-center space-x-3'>
                    {/* Only the owner can create new problems */}
                    {user.id === galaxy.owner_id && (
                        <button
                            onClick={() => setIsProblemModalOpen(true)}
                            className="px-4 py-2 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                        >
                            + **Create Problem Planet**
                        </button>
                    )}
                    <button
                        onClick={goBack}
                        className="px-4 py-2 text-white bg-gray-500 rounded-lg shadow-md hover:bg-gray-600 transition-colors"
                    >
                        Back to Browser
                    </button>
                </div>
            </header>

            {/* Conditional Rendering: Problem Details OR Problems List */}
            {currentProblem ? renderProblemDetails() : renderProblemPlanets()}
            
            {/* Create Problem Modal (Owner Only) */}
            <Modal 
                isOpen={isProblemModalOpen} 
                onClose={() => setIsProblemModalOpen(false)} 
                title="Create a New Problem Planet"
            >
                <form onSubmit={handleCreateProblem} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Problem Title"
                        value={newProblem.title}
                        onChange={(e) => setNewProblem({...newProblem, title: e.target.value})}
                        required
                        className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                    />
                    <textarea
                        placeholder="Detailed Problem Description..."
                        value={newProblem.description}
                        onChange={(e) => setNewProblem({...newProblem, description: e.target.value})}
                        rows="5"
                        required
                        className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                    ></textarea>
                    <button
                        type="submit"
                        className="w-full p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Launch Problem Planet
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default GalaxyView;