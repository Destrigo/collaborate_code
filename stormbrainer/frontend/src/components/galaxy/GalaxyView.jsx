// frontend/src/components/galaxy/GalaxyView.jsx

import React, { useState, useEffect, useRef } from 'react';
import { 
    getProblems, 
    createProblem, 
    getSolutions, 
    createSolution, 
    rateSolution 
} from '../../services/api';
import Modal from '../common/Modal';
import { Star, Plus, X, Send, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

// ============================================
// DRAGGABLE SOLAR SYSTEM COMPONENT
// ============================================

const DraggableSolarSystem = ({ problems, solutions, onProblemClick, onSolutionClick }) => {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Always call useEffect unconditionally
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const handleMouseDown = (e) => {
    if (e.target === containerRef.current || e.target.closest('.draggable-area')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleReset = () => {
    setPosition({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div className="relative w-full h-[90vh] bg-gradient-to-b from-indigo-950 via-purple-900 to-black rounded-xl overflow-hidden">
      {/* Show "No problems" message if empty */}
      {(!problems || problems.length === 0) && (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          No problems in this galaxy yet
        </div>
      )}

      {/* Controls */}
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
        <button onClick={handleZoomIn} className="p-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg text-white backdrop-blur-sm transition-colors" title="Zoom In">
          <ZoomIn size={20} />
        </button>
        <button onClick={handleZoomOut} className="p-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg text-white backdrop-blur-sm transition-colors" title="Zoom Out">
          <ZoomOut size={20} />
        </button>
        <button onClick={handleReset} className="p-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg text-white backdrop-blur-sm transition-colors" title="Reset View">
          <Maximize2 size={20} />
        </button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute top-4 left-4 z-50 px-3 py-2 bg-gray-800/80 rounded-lg text-white text-sm backdrop-blur-sm">
        Zoom: {(zoom * 100).toFixed(0)}%
      </div>

      {/* Only render solar system if problems exist */}
      {problems && problems.length > 0 && (
        <div
          ref={containerRef}
          className="draggable-area absolute inset-0 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            width: '300%',
            height: '300%',
            left: '-100%',
            top: '-100%'
          }}
        >
          {/* Starry background */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(300)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white animate-pulse"
                style={{
                  width: Math.random() * 2 + 1 + 'px',
                  height: Math.random() * 2 + 1 + 'px',
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
                  opacity: Math.random() * 0.7 + 0.3,
                  animationDuration: Math.random() * 3 + 2 + 's',
                  animationDelay: Math.random() * 2 + 's'
                }}
              />
            ))}
          </div>

          {/* Central Sun */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-30 blur-3xl animate-pulse" style={{ width: '200px', height: '200px', margin: '-50px' }} />
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500 shadow-2xl flex items-center justify-center animate-pulse">
                <Star className="w-16 h-16 text-white" fill="white" />
              </div>
            </div>
          </div>

          {/* Planets & Asteroids */}
          {problems.map((problem, index) => (
            <OrbitingPlanetWithAsteroids
              key={problem.id}
              problem={problem}
              solutions={solutions[problem.id] || []}
              orbitIndex={index}
              totalPlanets={problems.length}
              onProblemClick={onProblemClick}
              onSolutionClick={onSolutionClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Planet with Orbiting Asteroid Solutions
const OrbitingPlanetWithAsteroids = ({ problem, solutions, orbitIndex, totalPlanets, onProblemClick, onSolutionClick }) => {
  const [rotation, setRotation] = useState(0);

  const baseOrbitRadius = 180;
  const orbitRadius = baseOrbitRadius + (orbitIndex * 80);
  
  const baseSize = 50;
  const planetSize = Math.min(baseSize + (problem.stars || 0) * 2, 100);
  
  const startAngle = (orbitIndex * 360) / totalPlanets;

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const angle = ((rotation + startAngle) * Math.PI) / 180;
  const x = 50 + (orbitRadius / 4) * Math.cos(angle);
  const y = 50 + (orbitRadius / 4) * Math.sin(angle);

  const planetColors = [
    'from-blue-400 to-blue-600',
    'from-red-400 to-red-600',
    'from-green-400 to-green-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-cyan-400 to-cyan-600',
    'from-orange-400 to-orange-600',
    'from-teal-400 to-teal-600',
  ];

  return (
    <>
      {/* Orbit path */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 pointer-events-none"
        style={{
          width: `${(orbitRadius / 2)}%`,
          height: `${(orbitRadius / 2)}%`,
        }}
      />

      {/* Planet Container with Asteroids */}
      <div
        className="absolute"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Asteroid Solutions orbiting the planet */}
        {solutions.map((solution, sIdx) => (
          <Asteroid
            key={solution.id}
            solution={solution}
            asteroidIndex={sIdx}
            totalAsteroids={solutions.length}
            planetSize={planetSize}
            rotation={rotation}
            onClick={() => onSolutionClick(solution, problem)}
          />
        ))}

        {/* The Planet itself */}
        <div
          className="relative cursor-pointer transition-transform hover:scale-110 z-20"
          onClick={(e) => {
            e.stopPropagation();
            onProblemClick(problem);
          }}
        >
          {/* Planet glow */}
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${planetColors[orbitIndex % planetColors.length]} opacity-40 blur-xl pointer-events-none`}
            style={{ width: `${planetSize + 30}px`, height: `${planetSize + 30}px`, margin: '-15px' }}
          />

          {/* Planet body */}
          <div
            className={`relative rounded-full bg-gradient-to-br ${planetColors[orbitIndex % planetColors.length]} shadow-2xl flex items-center justify-center border-2 border-white/20`}
            style={{ width: `${planetSize}px`, height: `${planetSize}px` }}
          >
            <div className="absolute inset-0 rounded-full opacity-20 bg-gradient-to-br from-white/30 via-transparent to-black/30" />
            
            {/* Planet title */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity bg-black/90 px-3 py-1 rounded text-white text-xs whitespace-nowrap pointer-events-none z-30">
              {problem.title}
            </div>
          </div>

          {/* Star rating badge */}
          <div className="absolute -bottom-3 -right-3 bg-yellow-400 rounded-full px-2 py-1 text-xs font-bold flex items-center gap-1 shadow-lg pointer-events-none">
            <Star size={12} fill="currentColor" className="text-yellow-600" />
            {problem.stars || 0}
          </div>

          {/* Solution count badge */}
          {solutions.length > 0 && (
            <div className="absolute -top-3 -right-3 bg-purple-500 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold shadow-lg pointer-events-none">
              {solutions.length}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Asteroid (Solution) Component
const Asteroid = ({ solution, asteroidIndex, totalAsteroids, planetSize, rotation, onClick }) => {
  const asteroidOrbitRadius = planetSize / 2 + 30 + (asteroidIndex * 8);
  const asteroidAngle = ((rotation * 2 + asteroidIndex * (360 / totalAsteroids)) * Math.PI) / 180;
  
  const asteroidX = asteroidOrbitRadius * Math.cos(asteroidAngle);
  const asteroidY = asteroidOrbitRadius * Math.sin(asteroidAngle);
  
  const asteroidSize = Math.min(12 + (solution.stars || 0) * 2, 24);

  return (
    <div
      className="absolute cursor-pointer transition-transform hover:scale-150 z-10"
      style={{
        left: `${asteroidX}px`,
        top: `${asteroidY}px`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Asteroid glow */}
      <div
        className="absolute inset-0 rounded-full bg-gray-400 opacity-40 blur-md pointer-events-none"
        style={{ width: `${asteroidSize + 10}px`, height: `${asteroidSize + 10}px`, margin: '-5px' }}
      />
      
      {/* Asteroid body */}
      <div
        className="relative rounded-full bg-gradient-to-br from-gray-400 to-gray-600 shadow-lg border border-gray-300/30"
        style={{ 
          width: `${asteroidSize}px`, 
          height: `${asteroidSize}px`,
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
        }}
      />
      
      {/* Stars indicator */}
      {solution.stars > 0 && (
        <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold pointer-events-none">
          {solution.stars}
        </div>
      )}

      {/* Tooltip */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity bg-black/90 px-2 py-1 rounded text-white text-xs whitespace-nowrap pointer-events-none z-40">
        Solution by {solution.author_name || solution.author_username}
      </div>
    </div>
  );
};

// ============================================
// MAIN GALAXY VIEW COMPONENT
// ============================================

const GalaxyView = ({ user, galaxy, goBack }) => {
    const [problems, setProblems] = useState([]);
    const [solutions, setSolutions] = useState({});
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [selectedSolution, setSelectedSolution] = useState(null);
    const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
    const [newProblem, setNewProblem] = useState({ title: '', description: '' });
    const [newSolutionText, setNewSolutionText] = useState('');
    const [loading, setLoading] = useState(true);

    // Load problems for THIS specific galaxy only
    useEffect(() => {
        const loadProblems = async () => {
            try {
                setLoading(true);
                const p = await getProblems(galaxy.id);
                setProblems(p);
                
                // Load solutions for all problems
                const solutionsMap = {};
                for (const problem of p) {
                    try {
                        const sols = await getSolutions(problem.id);
                        solutionsMap[problem.id] = sols;
                    } catch (err) {
                        console.error(`Failed to load solutions for problem ${problem.id}:`, err);
                        solutionsMap[problem.id] = [];
                    }
                }
                setSolutions(solutionsMap);
            } catch (err) {
                alert(`Failed to load problems: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        loadProblems();
    }, [galaxy.id]);

    // Create New Problem (Owner only)
    const handleCreateProblem = async (e) => {
        e.preventDefault();
        try {
            const created = await createProblem(galaxy.id, newProblem.title, newProblem.description);
            setProblems([...problems, created]);
            setSolutions({...solutions, [created.id]: []});
            setIsProblemModalOpen(false);
            setNewProblem({ title: '', description: '' });
        } catch (error) {
            alert(`Error creating problem: ${error.message}`);
        }
    };

    // Handle planet click - show problem details
    const handleProblemClick = (problem) => {
        setSelectedProblem(problem);
        setSelectedSolution(null);
    };

    // Handle asteroid click - show solution details
    const handleSolutionClick = (solution, problem) => {
        setSelectedSolution({ ...solution, problemTitle: problem.title });
        setSelectedProblem(null);
    };

    // Create New Solution
    const handleCreateSolution = async () => {
        if (!newSolutionText.trim() || !selectedProblem) return;

        try {
            const created = await createSolution(selectedProblem.id, newSolutionText);
            setSolutions({
                ...solutions,
                [selectedProblem.id]: [...(solutions[selectedProblem.id] || []), created]
            });
            setNewSolutionText('');
        } catch (error) {
            alert(`Error submitting solution: ${error.message}`);
        }
    };
    
    // Handle Rating a Solution
    const handleRateSolution = async (solutionId, problemId) => {
        try {
            await rateSolution(solutionId, 1);
            
            // Reload solutions for this problem
            const updatedSolutions = await getSolutions(problemId);
            setSolutions({
                ...solutions,
                [problemId]: updatedSolutions
            });
            
            // Update selected solution if it's the one being rated
            if (selectedSolution && selectedSolution.id === solutionId) {
                const updated = updatedSolutions.find(s => s.id === solutionId);
                if (updated) {
                    setSelectedSolution({ ...updated, problemTitle: selectedSolution.problemTitle });
                }
            }
        } catch (error) {
            alert(`Error rating solution: ${error.message}`);
        }
    };

    const isOwner = user.id === galaxy.owner_id;

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="pb-4 border-b border-gray-300 dark:border-gray-700">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
                            {galaxy.name}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">{galaxy.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>Owner: {galaxy.owner_name}</span>
                            <span>•</span>
                            <span>{galaxy.member_count || 0} members</span>
                            <span>•</span>
                            <span>{problems.length} problems</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {isOwner && (
                            <button
                                onClick={() => setIsProblemModalOpen(true)}
                                className="px-4 py-2 text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 transition-colors flex items-center gap-2"
                            >
                                <Plus size={18} /> Create Problem
                            </button>
                        )}
                        <button
                            onClick={goBack}
                            className="px-4 py-2 text-white bg-gray-500 dark:bg-gray-600 rounded-lg shadow-md hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
                        >
                            ← Back
                        </button>
                    </div>
                </div>
            </header>

            {/* Solar System Visualization */}
            {loading ? (
                <div className="flex items-center justify-center h-[80vh] text-gray-400">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                        <p>Loading galaxy...</p>
                    </div>
                </div>
            ) : problems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[80vh] text-gray-400 dark:text-gray-500">
                    <p className="text-xl mb-4">No problems in this galaxy yet</p>
                    {isOwner && (
                        <p className="text-sm">Click "Create Problem" to add the first one!</p>
                    )}
                </div>
            ) : (
                <DraggableSolarSystem 
                    problems={problems}
                    solutions={solutions}
                    onProblemClick={handleProblemClick}
                    onSolutionClick={handleSolutionClick}
                />
            )}

            {/* Problem Detail Modal */}
            {selectedProblem && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{selectedProblem.title}</h2>
                                <p className="text-gray-600 dark:text-gray-400">{selectedProblem.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Star size={16} fill="gold" className="text-yellow-400" />
                                    <span className="font-bold text-gray-700 dark:text-gray-300">{selectedProblem.stars || 0} stars</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedProblem(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Solutions */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                Solutions ({solutions[selectedProblem.id]?.length || 0})
                            </h3>
                            
                            {/* Submit Solution */}
                            <div className="mb-4">
                                <textarea
                                    value={newSolutionText}
                                    onChange={(e) => setNewSolutionText(e.target.value)}
                                    placeholder="Share your solution..."
                                    className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none border border-gray-300 dark:border-gray-600"
                                    rows={3}
                                />
                                <button
                                    onClick={handleCreateSolution}
                                    className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <Send size={16} /> Submit Solution
                                </button>
                            </div>

                            {/* Solution List */}
                            <div className="space-y-3">
                                {!solutions[selectedProblem.id] || solutions[selectedProblem.id].length === 0 ? (
                                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                        No solutions yet. Be the first! Your solution will appear as an asteroid orbiting this planet.
                                    </p>
                                ) : (
                                    solutions[selectedProblem.id].map(solution => (
                                        <div key={solution.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-semibold text-purple-600 dark:text-purple-400">
                                                    {solution.author_name || solution.author_username}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                                                        <Star size={14} fill="gold" className="text-yellow-400" />
                                                        {solution.stars || 0}
                                                    </span>
                                                    <button
                                                        onClick={() => handleRateSolution(solution.id, selectedProblem.id)}
                                                        className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded text-xs transition-colors text-white"
                                                    >
                                                        +1 ⭐
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300">{solution.text}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Solution Detail Modal (when clicking asteroid) */}
            {selectedSolution && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                    Solution by {selectedSolution.author_name || selectedSolution.author_username}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    For: {selectedSolution.problemTitle}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedSolution(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedSolution.text}</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Star size={16} fill="gold" className="text-yellow-400" />
                                <span className="text-gray-700 dark:text-gray-300">{selectedSolution.stars || 0} stars</span>
                            </div>
                            <button
                                onClick={() => handleRateSolution(selectedSolution.id, selectedSolution.problem_id)}
                                className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1.5 rounded text-sm transition-colors text-white"
                            >
                                +1 ⭐ Give Star
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Create Problem Modal (Owner Only) */}
            {isProblemModalOpen && (
                <Modal 
                    isOpen={isProblemModalOpen} 
                    onClose={() => setIsProblemModalOpen(false)} 
                    title="Create a New Problem"
                >
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Problem Title"
                            value={newProblem.title}
                            onChange={(e) => setNewProblem({...newProblem, title: e.target.value})}
                            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                        />
                        <textarea
                            placeholder="Detailed Problem Description..."
                            value={newProblem.description}
                            onChange={(e) => setNewProblem({...newProblem, description: e.target.value})}
                            rows={5}
                            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                        />
                        <button
                            onClick={handleCreateProblem}
                            className="w-full p-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Create Problem
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default GalaxyView;
// import React, { useState } from 'react';
// import { 
//     getProblems, 
//     createProblem, 
//     getSolutions, 
//     createSolution, 
//     rateSolution 
// } from '../../services/api';
// import Modal from '../common/Modal';
// import { Star, Plus, X, Send } from 'lucide-react';

// const GalaxyView = ({ user, galaxy, goBack, SolarSystemGalaxy }) => {
//     const [problems, setProblems] = useState([]);
//     const [solutions, setSolutions] = useState([]);
//     const [currentProblem, setCurrentProblem] = useState(null);
//     const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
//     const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
//     const [newProblem, setNewProblem] = useState({ title: '', description: '' });
//     const [newSolution, setNewSolution] = useState('');
//     const [loading, setLoading] = useState(true);

//     // Load problems for THIS specific galaxy only
//     React.useEffect(() => {
//         const loadProblems = async () => {
//             try {
//                 setLoading(true);
//                 // This fetches ONLY problems belonging to the current galaxy
//                 const p = await getProblems(galaxy.id);
//                 setProblems(p);
//             } catch (err) {
//                 alert(`Failed to load problems: ${err.message}`);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         loadProblems();
//     }, [galaxy.id]);

//     // Load solutions for a selected problem
//     const loadSolutions = async (problemId) => {
//         try {
//             const s = await getSolutions(problemId);
//             setSolutions(s);
//         } catch (err) {
//             alert(`Failed to load solutions: ${err.message}`);
//         }
//     };

//     // Open Problem Detail/Solutions View
//     const handleViewProblem = async (problem) => {
//         setCurrentProblem(problem);
//         await loadSolutions(problem.id);
//     };
    
//     // Close Problem Detail View
//     const handleCloseProblemView = () => {
//         setCurrentProblem(null);
//         setSolutions([]);
//     };

//     // Create New Problem (Owner only)
//     const handleCreateProblem = async (e) => {
//         e.preventDefault();
//         try {
//             const created = await createProblem(galaxy.id, newProblem.title, newProblem.description);
//             setProblems([...problems, created]);
//             setIsProblemModalOpen(false);
//             setNewProblem({ title: '', description: '' });
//         } catch (error) {
//             alert(`Error creating problem: ${error.message}`);
//         }
//     };

//     // Create New Solution
//     const handleCreateSolution = async (e) => {
//         e.preventDefault();
//         if (!currentProblem) return;

//         try {
//             const created = await createSolution(currentProblem.id, newSolution);
//             setSolutions([...solutions, created]);
//             setIsSolutionModalOpen(false);
//             setNewSolution('');
//         } catch (error) {
//             alert(`Error submitting solution: ${error.message}`);
//         }
//     };
    
//     // Handle Rating a Solution (Star)
//     const handleRateSolution = async (solutionId) => {
//         try {
//             await rateSolution(solutionId, 1);
            
//             // Reload solutions to get updated stars
//             await loadSolutions(currentProblem.id);
//         } catch (error) {
//             alert(`Error rating solution: ${error.message}`);
//         }
//     };

//     const isOwner = user.id === galaxy.owner_id;

//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <header className="pb-4 border-b border-gray-300 dark:border-gray-700">
//                 <div className="flex justify-between items-start mb-4">
//                     <div>
//                         <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
//                             {galaxy.name}
//                         </h2>
//                         <p className="text-gray-600 dark:text-gray-400">{galaxy.description}</p>
//                         <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
//                             <span>Owner: {galaxy.owner_name}</span>
//                             <span>•</span>
//                             <span>{galaxy.member_count || 0} members</span>
//                             <span>•</span>
//                             <span>{problems.length} problems</span>
//                         </div>
//                     </div>
                    
//                     <div className="flex items-center gap-3">
//                         {isOwner && (
//                             <button
//                                 onClick={() => setIsProblemModalOpen(true)}
//                                 className="px-4 py-2 text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 transition-colors flex items-center gap-2"
//                             >
//                                 <Plus size={18} /> Create Problem
//                             </button>
//                         )}
//                         <button
//                             onClick={goBack}
//                             className="px-4 py-2 text-white bg-gray-500 dark:bg-gray-600 rounded-lg shadow-md hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
//                         >
//                             ← Back
//                         </button>
//                     </div>
//                 </div>
//             </header>

//             {/* Solar System Visualization */}
//             {loading ? (
//                 <div className="flex items-center justify-center h-[80vh] text-gray-400">
//                     <div className="text-center">
//                         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
//                         <p>Loading galaxy...</p>
//                     </div>
//                 </div>
//             ) : problems.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-[80vh] text-gray-400 dark:text-gray-500">
//                     <p className="text-xl mb-4">No problems in this galaxy yet</p>
//                     {isOwner && (
//                         <p className="text-sm">Click "Create Problem" to add the first one!</p>
//                     )}
//                 </div>
//             ) : (
//                 <SolarSystemGalaxy 
//                     problems={problems}
//                     onProblemClick={handleViewProblem}
//                 />
//             )}

//             {/* Instructions */}
//             <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
//                 <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base text-center">
//                     ☀️ The <span className="text-yellow-500 font-bold">Sun</span> represents your galaxy center
//                     <span className="mx-2 md:mx-4">•</span>
//                     🪐 <span className="text-blue-500 font-bold">Planets</span> are problems orbiting around it
//                     <span className="mx-2 md:mx-4">•</span>
//                     ⭐ <span className="text-yellow-500 font-bold">Larger planets</span> = more stars
//                     <span className="mx-2 md:mx-4">•</span>
//                     🔄 <span className="text-purple-500 font-bold">Click</span> a planet to see solutions
//                 </p>
//             </div>

//             {/* Problem Detail Modal */}
//             {currentProblem && (
//                 <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
//                     <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
//                         <div className="flex justify-between items-start mb-4">
//                             <div>
//                                 <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{currentProblem.title}</h2>
//                                 <p className="text-gray-600 dark:text-gray-400">{currentProblem.description}</p>
//                                 <div className="flex items-center gap-2 mt-2">
//                                     <Star size={16} fill="gold" className="text-yellow-400" />
//                                     <span className="font-bold text-gray-700 dark:text-gray-300">{currentProblem.stars || 0} stars</span>
//                                 </div>
//                             </div>
//                             <button
//                                 onClick={handleCloseProblemView}
//                                 className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
//                             >
//                                 <X size={24} />
//                             </button>
//                         </div>

//                         {/* Solutions */}
//                         <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
//                             <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Solutions</h3>
                            
//                             {/* Submit Solution */}
//                             <div className="mb-4">
//                                 <textarea
//                                     value={newSolution}
//                                     onChange={(e) => setNewSolution(e.target.value)}
//                                     placeholder="Share your solution..."
//                                     className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none border border-gray-300 dark:border-gray-600"
//                                     rows={3}
//                                 />
//                                 <button
//                                     onClick={handleCreateSolution}
//                                     className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//                                 >
//                                     <Send size={16} /> Submit Solution
//                                 </button>
//                             </div>

//                             {/* Solution List */}
//                             <div className="space-y-3">
//                                 {solutions.length === 0 ? (
//                                     <p className="text-gray-500 dark:text-gray-400 text-center py-4">No solutions yet. Be the first!</p>
//                                 ) : (
//                                     solutions.map(solution => (
//                                         <div key={solution.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
//                                             <div className="flex justify-between items-start mb-2">
//                                                 <span className="font-semibold text-purple-600 dark:text-purple-400">
//                                                     {solution.author_name || solution.author_username}
//                                                 </span>
//                                                 <div className="flex items-center gap-2">
//                                                     <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
//                                                         <Star size={14} fill="gold" className="text-yellow-400" />
//                                                         {solution.stars || 0}
//                                                     </span>
//                                                     <button
//                                                         onClick={() => handleRateSolution(solution.id)}
//                                                         className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded text-xs transition-colors text-white"
//                                                     >
//                                                         +1 ⭐
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                             <p className="text-gray-700 dark:text-gray-300">{solution.text}</p>
//                                         </div>
//                                     ))
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
            
//             {/* Create Problem Modal (Owner Only) */}
//             {isProblemModalOpen && (
//                 <Modal 
//                     isOpen={isProblemModalOpen} 
//                     onClose={() => setIsProblemModalOpen(false)} 
//                     title="Create a New Problem"
//                 >
//                     <div className="space-y-4">
//                         <input
//                             type="text"
//                             placeholder="Problem Title"
//                             value={newProblem.title}
//                             onChange={(e) => setNewProblem({...newProblem, title: e.target.value})}
//                             className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
//                         />
//                         <textarea
//                             placeholder="Detailed Problem Description..."
//                             value={newProblem.description}
//                             onChange={(e) => setNewProblem({...newProblem, description: e.target.value})}
//                             rows={5}
//                             className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
//                         />
//                         <button
//                             onClick={handleCreateProblem}
//                             className="w-full p-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
//                         >
//                             Create Problem
//                         </button>
//                     </div>
//                 </Modal>
//             )}
//         </div>
//     );
// };

// export default GalaxyView;