// import React, { useState, useEffect } from 'react';
// import { Star, Plus, X, Send } from 'lucide-react';

// // Solar System Galaxy Visualization Component
// const SolarSystemGalaxy = ({ problems, onProblemClick }) => {
//   if (!problems || problems.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-96 text-gray-500">
//         No problems in this galaxy yet
//       </div>
//     );
//   }

//   return (
//     <div className="relative w-full h-[600px] bg-gradient-to-b from-indigo-950 via-purple-900 to-black rounded-xl overflow-hidden">
//       {/* Starry background */}
//       <div className="absolute inset-0">
//         {[...Array(100)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute rounded-full bg-white animate-pulse"
//             style={{
//               width: Math.random() * 2 + 1 + 'px',
//               height: Math.random() * 2 + 1 + 'px',
//               top: Math.random() * 100 + '%',
//               left: Math.random() * 100 + '%',
//               opacity: Math.random() * 0.7 + 0.3,
//               animationDuration: Math.random() * 3 + 2 + 's',
//               animationDelay: Math.random() * 2 + 's'
//             }}
//           />
//         ))}
//       </div>

//       {/* Central Sun */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
//         <div className="relative">
//           {/* Sun glow effect */}
//           <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-30 blur-3xl animate-pulse" 
//                style={{ width: '150px', height: '150px', margin: '-25px' }} />
          
//           {/* Sun core */}
//           <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500 shadow-2xl flex items-center justify-center animate-pulse">
//             <Star className="w-12 h-12 text-white" fill="white" />
//           </div>
//         </div>
//       </div>

//       {/* Orbiting Problems as Planets */}
//       {problems.map((problem, index) => (
//         <OrbitingPlanet
//           key={problem.id}
//           problem={problem}
//           orbitIndex={index}
//           totalPlanets={problems.length}
//           onClick={() => onProblemClick(problem)}
//         />
//       ))}
//     </div>
//   );
// };

// // Individual Orbiting Planet Component
// const OrbitingPlanet = ({ problem, orbitIndex, totalPlanets, onClick }) => {
//   const [rotation, setRotation] = useState(0);

//   // Calculate orbit radius (distance from sun)
//   const baseOrbitRadius = 120;
//   const orbitRadius = baseOrbitRadius + (orbitIndex * 60);
  
//   // Calculate planet size based on stars (rating)
//   const baseSize = 40;
//   const planetSize = Math.min(baseSize + (problem.stars || 0) * 3, 80);
  
//   // Different orbit speeds for variety
//   const orbitSpeed = 20 + (orbitIndex * 5); // seconds per rotation
  
//   // Different starting positions to spread planets
//   const startAngle = (orbitIndex * 360) / totalPlanets;

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setRotation(prev => (prev + 1) % 360);
//     }, orbitSpeed * 10);

//     return () => clearInterval(interval);
//   }, [orbitSpeed]);

//   // Calculate planet position
//   const angle = ((rotation + startAngle) * Math.PI) / 180;
//   const x = 50 + (orbitRadius / 6) * Math.cos(angle);
//   const y = 50 + (orbitRadius / 6) * Math.sin(angle);

//   // Planet colors based on index
//   const planetColors = [
//     'from-blue-400 to-blue-600',
//     'from-red-400 to-red-600',
//     'from-green-400 to-green-600',
//     'from-purple-400 to-purple-600',
//     'from-pink-400 to-pink-600',
//     'from-cyan-400 to-cyan-600',
//     'from-orange-400 to-orange-600',
//     'from-teal-400 to-teal-600',
//   ];

//   return (
//     <>
//       {/* Orbit path */}
//       <div
//         className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
//         style={{
//           width: `${(orbitRadius / 3)}%`,
//           height: `${(orbitRadius / 3)}%`,
//         }}
//       />

//       {/* Planet */}
//       <div
//         className="absolute cursor-pointer transition-transform hover:scale-125 z-20"
//         style={{
//           left: `${x}%`,
//           top: `${y}%`,
//           transform: 'translate(-50%, -50%)',
//         }}
//         onClick={onClick}
//       >
//         {/* Planet glow */}
//         <div
//           className={`absolute inset-0 rounded-full bg-gradient-to-br ${planetColors[orbitIndex % planetColors.length]} opacity-40 blur-xl`}
//           style={{ width: `${planetSize + 20}px`, height: `${planetSize + 20}px`, margin: '-10px' }}
//         />

//         {/* Planet body */}
//         <div
//           className={`relative rounded-full bg-gradient-to-br ${planetColors[orbitIndex % planetColors.length]} shadow-2xl flex items-center justify-center border-2 border-white/20`}
//           style={{ width: `${planetSize}px`, height: `${planetSize}px` }}
//         >
//           {/* Planet texture/pattern */}
//           <div className="absolute inset-0 rounded-full opacity-20 bg-gradient-to-br from-white/30 via-transparent to-black/30" />
          
//           {/* Planet title (on hover, shown via group) */}
//           <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-white text-xs whitespace-nowrap pointer-events-none">
//             {problem.title}
//           </div>
//         </div>

//         {/* Star rating badge */}
//         <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full px-2 py-1 text-xs font-bold flex items-center gap-1 shadow-lg">
//           <Star size={12} fill="currentColor" className="text-yellow-600" />
//           {problem.stars || 0}
//         </div>
//       </div>
//     </>
//   );
// };

// // Demo App with Sample Data
// const App = () => {
//   const [selectedProblem, setSelectedProblem] = useState(null);
//   const [showAddProblem, setShowAddProblem] = useState(false);
//   const [problems, setProblems] = useState([
//     { id: 1, title: 'Binary Search Trees', description: 'Implement a balanced BST with insert and delete operations', stars: 15 },
//     { id: 2, title: 'Fibonacci Sequence', description: 'Calculate the nth Fibonacci number efficiently', stars: 8 },
//     { id: 3, title: 'Graph Traversal', description: 'Implement DFS and BFS algorithms', stars: 22 },
//     { id: 4, title: 'Dynamic Programming', description: 'Solve the knapsack problem', stars: 12 },
//     { id: 5, title: 'Sorting Algorithms', description: 'Compare quicksort vs mergesort', stars: 5 },
//     { id: 6, title: 'Hash Tables', description: 'Design a hash table with collision handling', stars: 18 }
//   ]);

//   const [solutions, setSolutions] = useState({});
//   const [newSolution, setNewSolution] = useState('');

//   const handleAddProblem = (title, description) => {
//     const newProblem = {
//       id: Date.now(),
//       title,
//       description,
//       stars: 0
//     };
//     setProblems([...problems, newProblem]);
//     setShowAddProblem(false);
//   };

//   const handleSubmitSolution = (problemId) => {
//     if (!newSolution.trim()) return;
    
//     setSolutions({
//       ...solutions,
//       [problemId]: [...(solutions[problemId] || []), {
//         id: Date.now(),
//         text: newSolution,
//         author: 'You',
//         stars: 0
//       }]
//     });
//     setNewSolution('');
//   };

//   const handleRateSolution = (problemId, solutionId) => {
//     // Update solution stars
//     setSolutions({
//       ...solutions,
//       [problemId]: solutions[problemId].map(sol => 
//         sol.id === solutionId ? { ...sol, stars: sol.stars + 1 } : sol
//       )
//     });

//     // Update problem stars
//     setProblems(problems.map(p => 
//       p.id === problemId ? { ...p, stars: p.stars + 1 } : p
//     ));
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 flex justify-between items-center">
//           <div>
//             <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//               StormBrainer Galaxy
//             </h1>
//             <p className="text-gray-400">Explore the solar system of problems</p>
//           </div>
//           <button
//             onClick={() => setShowAddProblem(true)}
//             className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//           >
//             <Plus size={20} /> Add Problem
//           </button>
//         </div>

//         {/* Solar System Visualization */}
//         <SolarSystemGalaxy 
//           problems={problems}
//           onProblemClick={setSelectedProblem}
//         />

//         {/* Instructions */}
//         <div className="mt-8 p-4 bg-gray-800 rounded-lg text-center">
//           <p className="text-gray-300">
//             ☀️ The <span className="text-yellow-400 font-bold">Sun</span> represents your galaxy center
//             <span className="mx-4">•</span>
//             🪐 <span className="text-blue-400 font-bold">Planets</span> are problems orbiting around it
//             <span className="mx-4">•</span>
//             ⭐ <span className="text-yellow-400 font-bold">Larger planets</span> = more stars (ratings)
//             <span className="mx-4">•</span>
//             🔄 Each planet has its own <span className="text-purple-400 font-bold">orbit speed</span>
//           </p>
//         </div>

//         {/* Problem Detail Modal */}
//         {selectedProblem && (
//           <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
//             <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h2 className="text-2xl font-bold mb-2">{selectedProblem.title}</h2>
//                   <p className="text-gray-400">{selectedProblem.description}</p>
//                   <div className="flex items-center gap-2 mt-2">
//                     <Star size={16} fill="gold" className="text-yellow-400" />
//                     <span className="font-bold">{selectedProblem.stars} stars</span>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setSelectedProblem(null)}
//                   className="text-gray-400 hover:text-white"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>

//               {/* Solutions */}
//               <div className="border-t border-gray-700 pt-4">
//                 <h3 className="text-xl font-bold mb-4">Solutions</h3>
                
//                 {/* Submit Solution */}
//                 <div className="mb-4">
//                   <textarea
//                     value={newSolution}
//                     onChange={(e) => setNewSolution(e.target.value)}
//                     placeholder="Share your solution..."
//                     className="w-full bg-gray-700 rounded-lg p-3 text-white placeholder-gray-400 resize-none"
//                     rows="3"
//                   />
//                   <button
//                     onClick={() => handleSubmitSolution(selectedProblem.id)}
//                     className="mt-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//                   >
//                     <Send size={16} /> Submit Solution
//                   </button>
//                 </div>

//                 {/* Solution List */}
//                 <div className="space-y-3">
//                   {(solutions[selectedProblem.id] || []).map(solution => (
//                     <div key={solution.id} className="bg-gray-700 rounded-lg p-4">
//                       <div className="flex justify-between items-start mb-2">
//                         <span className="font-semibold text-purple-400">{solution.author}</span>
//                         <div className="flex items-center gap-2">
//                           <span className="flex items-center gap-1">
//                             <Star size={14} fill="gold" className="text-yellow-400" />
//                             {solution.stars}
//                           </span>
//                           <button
//                             onClick={() => handleRateSolution(selectedProblem.id, solution.id)}
//                             className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded text-xs transition-colors"
//                           >
//                             +1 ⭐
//                           </button>
//                         </div>
//                       </div>
//                       <p className="text-gray-300">{solution.text}</p>
//                     </div>
//                   ))}
//                   {(!solutions[selectedProblem.id] || solutions[selectedProblem.id].length === 0) && (
//                     <p className="text-gray-500 text-center py-4">No solutions yet. Be the first!</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Add Problem Modal */}
//         {showAddProblem && (
//           <AddProblemModal
//             onClose={() => setShowAddProblem(false)}
//             onAdd={handleAddProblem}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// // Add Problem Modal Component
// const AddProblemModal = ({ onClose, onAdd }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (title && description) {
//       onAdd(title, description);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
//       <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
//         <h2 className="text-2xl font-bold mb-4">Add New Problem</h2>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Problem Title"
//             className="w-full bg-gray-700 rounded-lg p-3 mb-3 text-white placeholder-gray-400"
//             required
//           />
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Problem Description"
//             className="w-full bg-gray-700 rounded-lg p-3 mb-4 text-white placeholder-gray-400 resize-none"
//             rows="4"
//             required
//           />
//           <div className="flex gap-2">
//             <button
//               type="submit"
//               className="flex-1 bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition-colors"
//             >
//               Add Problem
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg transition-colors"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default App;
// // // frontend/src/components/galaxy/GalaxyView.jsx

// // import React, { useState, useEffect } from 'react';
// // import { 
// //     getProblems, 
// //     createProblem, 
// //     getSolutions, 
// //     createSolution, 
// //     rateSolution 
// // } from '../../services/api';
// // // Assuming Modal component exists in common
// // import Modal from '../common/Modal'; 

// // // --- Helper Components for Visualization ---

// // // Function to determine planet size based on rating (stars)
// // const getPlanetSizeClass = (stars) => {
// //     if (stars >= 50) return 'w-28 h-28 text-3xl'; // Supergiant
// //     if (stars >= 20) return 'w-20 h-20 text-2xl'; // Giant
// //     if (stars >= 5) return 'w-14 h-14 text-xl';   // Large
// //     if (stars >= 1) return 'w-10 h-10 text-lg';   // Medium
// //     return 'w-8 h-8 text-base';                    // Small
// // };

// // // Component for the "Planet" Visualization (Problem or Solution)
// // const Planet = ({ item, type, onClick }) => {
// //     const sizeClass = getPlanetSizeClass(item.stars || 0); // Use 0 for problems if they don't have stars yet
// //     const color = type === 'problem' ? 'bg-indigo-600' : 'bg-teal-500';
// //     const shadow = type === 'problem' ? 'shadow-indigo-500/50' : 'shadow-teal-400/50';

// //     return (
// //         <div 
// //             className={`relative rounded-full ${sizeClass} ${color} flex items-center justify-center p-2 text-white font-bold cursor-pointer transition-all duration-500 transform hover:scale-110 shadow-xl ${shadow} ring-4 ring-white/10 group`}
// //             onClick={onClick}
// //         >
// //             <span className="truncate max-w-full p-1 text-center text-xs pointer-events-none">
// //                 {type === 'problem' ? item.title : `${item.stars} ⭐`}
// //             </span>
            
// //             {/* Tooltip on Hover */}
// //             <div className="absolute top-full mt-2 hidden group-hover:block z-50 p-3 bg-gray-800 rounded-lg shadow-2xl text-white text-sm whitespace-pre-wrap w-64 text-left">
// //                 <h4 className="font-bold mb-1">{item.title || `Solution by ${item.author_username}`}</h4>
// //                 <p className="text-gray-300 line-clamp-3">{item.description || item.text}</p>
// //                 <p className="mt-2 text-yellow-400">Rating: **{item.stars || 0}** ⭐</p>
// //             </div>
// //         </div>
// //     );
// // };


// // // --- Main Component ---

// // const GalaxyView = ({ user, galaxy, goBack }) => {
// //     const [problems, setProblems] = useState([]);
// //     const [solutions, setSolutions] = useState([]);
// //     const [currentProblem, setCurrentProblem] = useState(null);
// //     const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
// //     const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
// //     const [newProblem, setNewProblem] = useState({ title: '', description: '' });
// //     const [newSolution, setNewSolution] = useState('');

// //     // Fetch all problems when galaxy changes
// //     useEffect(() => {
// //         const loadProblems = async () => {
// //             try {
// //                 const p = await getProblems(galaxy.id);
// //                 setProblems(p);
// //             } catch (err) {
// //                 alert(`Failed to load problems: ${err.message}`);
// //             }
// //         };
// //         loadProblems();
// //     }, [galaxy.id]);

// //     // Load solutions for a selected problem
// //     const loadSolutions = async (problemId) => {
// //         try {
// //             const s = await getSolutions(problemId);
// //             setSolutions(s);
// //         } catch (err) {
// //             alert(`Failed to load solutions: ${err.message}`);
// //         }
// //     };

// //     // Open Problem Detail/Solutions View
// //     const handleViewProblem = async (problem) => {
// //         setCurrentProblem(problem);
// //         await loadSolutions(problem.id);
// //     };
    
// //     // Close Problem Detail View
// //     const handleCloseProblemView = () => {
// //         setCurrentProblem(null);
// //         setSolutions([]);
// //     };

// //     // Create New Problem (Owner only)
// //     const handleCreateProblem = async (e) => {
// //         e.preventDefault();
// //         try {
// //             const created = await createProblem(galaxy.id, newProblem.title, newProblem.description);
// //             setProblems([...problems, created]);
// //             setIsProblemModalOpen(false);
// //             setNewProblem({ title: '', description: '' });
// //         } catch (error) {
// //             alert(`Error creating problem: ${error.message}`);
// //         }
// //     };

// //     // Create New Solution
// //     const handleCreateSolution = async (e) => {
// //         e.preventDefault();
// //         if (!currentProblem) return;

// //         try {
// //             const created = await createSolution(currentProblem.id, newSolution);
// //             setSolutions([...solutions, created]);
// //             setIsSolutionModalOpen(false);
// //             setNewSolution('');
// //         } catch (error) {
// //             alert(`Error submitting solution: ${error.message}`);
// //         }
// //     };
    
// //     // Handle Rating a Solution (Star)
// //     const handleRateSolution = async (solutionId) => {
// //         try {
// //             const updatedSolution = await rateSolution(solutionId, 1); // Value 1 for star
            
// //             // Update the solution list
// //             setSolutions(solutions.map(s => 
// //                 s.id === solutionId ? updatedSolution : s
// //             ));
            
// //             // Optionally, refresh user data to show updated global rating
// //             // Refreshing the whole app state would be better here, but we keep it simple.
// //             alert(`Solution by ${updatedSolution.author_username} received a star!`);
// //         } catch (error) {
// //             alert(`Error rating solution: ${error.message}`);
// //         }
// //     };
    
// //     // --- Rendering Functions ---
    
// //     const renderProblemPlanets = () => (
// //         <div className="relative flex flex-wrap justify-around items-center min-h-[500px] border border-gray-700/50 rounded-xl p-8 bg-gray-900/50 backdrop-blur-sm">
// //             <h3 className="absolute top-4 left-4 text-xl font-bold text-white/70">
// //                 **Problems** (Click a Planet to View Solutions)
// //             </h3>
// //             {problems.length === 0 && (
// //                 <p className="text-center text-gray-500">
// //                     No problems in this galaxy yet. {user.id === galaxy.owner_id ? 'Start by creating one!' : 'Wait for the owner to post!'}
// //                 </p>
// //             )}
// //             {problems.map(p => (
// //                 <div key={p.id} className="m-4">
// //                     <Planet 
// //                         item={p} 
// //                         type="problem" 
// //                         onClick={() => handleViewProblem(p)} 
// //                     />
// //                 </div>
// //             ))}
// //         </div>
// //     );
    
// //     const renderProblemDetails = () => (
// //         <div className="relative p-6 bg-gray-800 rounded-xl shadow-2xl border border-indigo-500/50">
// //             <button 
// //                 onClick={handleCloseProblemView} 
// //                 className="absolute top-4 right-4 p-2 bg-gray-700 rounded-full hover:bg-gray-600 text-white z-20"
// //                 title="Back to Problems"
// //             >
// //                 &#8592;
// //             </button>
            
// //             <h3 className="text-4xl font-extrabold text-indigo-400 mb-2">{currentProblem.title}</h3>
// //             <p className="text-lg text-gray-300 mb-6 border-b border-gray-700 pb-4">
// //                 {currentProblem.description}
// //             </p>

// //             {/* Solutions Section */}
// //             <div className="space-y-8">
// //                 <header className="flex justify-between items-center">
// //                     <h4 className="text-2xl font-bold text-teal-400">
// //                         **Solutions** ({solutions.length} Planets)
// //                     </h4>
// //                     <button
// //                         onClick={() => setIsSolutionModalOpen(true)}
// //                         className="px-4 py-2 text-white bg-teal-500 rounded-lg shadow-md hover:bg-teal-600 transition-colors"
// //                     >
// //                         Submit a Solution
// //                     </button>
// //                 </header>

// //                 {/* Solutions Visualization */}
// //                 <div className="flex flex-wrap gap-8 justify-center items-center min-h-[200px] p-4 bg-gray-900/50 rounded-xl">
// //                     {solutions.length === 0 ? (
// //                         <p className="text-center text-gray-500">
// //                             No one has proposed a solution yet. Be the first!
// //                         </p>
// //                     ) : (
// //                         solutions.map(s => (
// //                             <div key={s.id} className="relative group">
// //                                 <Planet 
// //                                     item={s} 
// //                                     type="solution" 
// //                                     onClick={() => alert(`Solution by ${s.author_username}:\n\n${s.text}\n\nRating: ${s.stars} ⭐`)}
// //                                 />
// //                                 <div className="absolute top-full -left-1/2 mt-2 w-20 p-1 bg-gray-700 rounded-lg shadow-xl text-xs flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
// //                                     <button 
// //                                         onClick={() => handleRateSolution(s.id)}
// //                                         className="text-yellow-400 hover:text-yellow-300 transition-colors"
// //                                         title="Give a Star"
// //                                     >
// //                                         ⭐ Star
// //                                     </button>
// //                                 </div>
// //                             </div>
// //                         ))
// //                     )}
// //                 </div>
// //             </div>
            
// //             {/* Submit Solution Modal */}
// //             <Modal 
// //                 isOpen={isSolutionModalOpen} 
// //                 onClose={() => setIsSolutionModalOpen(false)} 
// //                 title={`Submit Solution for: ${currentProblem.title}`}
// //             >
// //                 <form onSubmit={handleCreateSolution} className="space-y-4">
// //                     <textarea
// //                         placeholder="Your detailed solution..."
// //                         value={newSolution}
// //                         onChange={(e) => setNewSolution(e.target.value)}
// //                         rows="6"
// //                         required
// //                         className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
// //                     ></textarea>
// //                     <button
// //                         type="submit"
// //                         className="w-full p-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors"
// //                     >
// //                         Launch Solution Planet
// //                     </button>
// //                 </form>
// //             </Modal>
// //         </div>
// //     );

// //     // --- Main Render ---

// //     return (
// //         <div className="space-y-8">
// //             <header className="pb-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
// //                 <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-500">
// //                     Viewing Galaxy: **{galaxy.name}**
// //                 </h2>
// //                 <div className='flex items-center space-x-3'>
// //                     {/* Only the owner can create new problems */}
// //                     {user.id === galaxy.owner_id && (
// //                         <button
// //                             onClick={() => setIsProblemModalOpen(true)}
// //                             className="px-4 py-2 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
// //                         >
// //                             + **Create Problem Planet**
// //                         </button>
// //                     )}
// //                     <button
// //                         onClick={goBack}
// //                         className="px-4 py-2 text-white bg-gray-500 rounded-lg shadow-md hover:bg-gray-600 transition-colors"
// //                     >
// //                         Back to Browser
// //                     </button>
// //                 </div>
// //             </header>

// //             {/* Conditional Rendering: Problem Details OR Problems List */}
// //             {currentProblem ? renderProblemDetails() : renderProblemPlanets()}
            
// //             {/* Create Problem Modal (Owner Only) */}
// //             <Modal 
// //                 isOpen={isProblemModalOpen} 
// //                 onClose={() => setIsProblemModalOpen(false)} 
// //                 title="Create a New Problem Planet"
// //             >
// //                 <form onSubmit={handleCreateProblem} className="space-y-4">
// //                     <input
// //                         type="text"
// //                         placeholder="Problem Title"
// //                         value={newProblem.title}
// //                         onChange={(e) => setNewProblem({...newProblem, title: e.target.value})}
// //                         required
// //                         className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
// //                     />
// //                     <textarea
// //                         placeholder="Detailed Problem Description..."
// //                         value={newProblem.description}
// //                         onChange={(e) => setNewProblem({...newProblem, description: e.target.value})}
// //                         rows="5"
// //                         required
// //                         className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
// //                     ></textarea>
// //                     <button
// //                         type="submit"
// //                         className="w-full p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
// //                     >
// //                         Launch Problem Planet
// //                     </button>
// //                 </form>
// //             </Modal>
// //         </div>
// //     );
// // };

// // export default GalaxyView;
// frontend/src/components/galaxy/GalaxyView.jsx

import React, { useState } from 'react';
import { 
    getProblems, 
    createProblem, 
    getSolutions, 
    createSolution, 
    rateSolution 
} from '../../services/api';
import Modal from '../common/Modal';
import { Star, Plus, X, Send } from 'lucide-react';

const GalaxyView = ({ user, galaxy, goBack, SolarSystemGalaxy }) => {
    const [problems, setProblems] = useState([]);
    const [solutions, setSolutions] = useState([]);
    const [currentProblem, setCurrentProblem] = useState(null);
    const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
    const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
    const [newProblem, setNewProblem] = useState({ title: '', description: '' });
    const [newSolution, setNewSolution] = useState('');
    const [loading, setLoading] = useState(true);

    // Load problems for THIS specific galaxy only
    React.useEffect(() => {
        const loadProblems = async () => {
            try {
                setLoading(true);
                // This fetches ONLY problems belonging to the current galaxy
                const p = await getProblems(galaxy.id);
                setProblems(p);
            } catch (err) {
                alert(`Failed to load problems: ${err.message}`);
            } finally {
                setLoading(false);
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
            await rateSolution(solutionId, 1);
            
            // Reload solutions to get updated stars
            await loadSolutions(currentProblem.id);
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
                <SolarSystemGalaxy 
                    problems={problems}
                    onProblemClick={handleViewProblem}
                />
            )}

            {/* Instructions */}
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base text-center">
                    ☀️ The <span className="text-yellow-500 font-bold">Sun</span> represents your galaxy center
                    <span className="mx-2 md:mx-4">•</span>
                    🪐 <span className="text-blue-500 font-bold">Planets</span> are problems orbiting around it
                    <span className="mx-2 md:mx-4">•</span>
                    ⭐ <span className="text-yellow-500 font-bold">Larger planets</span> = more stars
                    <span className="mx-2 md:mx-4">•</span>
                    🔄 <span className="text-purple-500 font-bold">Click</span> a planet to see solutions
                </p>
            </div>

            {/* Problem Detail Modal */}
            {currentProblem && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{currentProblem.title}</h2>
                                <p className="text-gray-600 dark:text-gray-400">{currentProblem.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Star size={16} fill="gold" className="text-yellow-400" />
                                    <span className="font-bold text-gray-700 dark:text-gray-300">{currentProblem.stars || 0} stars</span>
                                </div>
                            </div>
                            <button
                                onClick={handleCloseProblemView}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Solutions */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Solutions</h3>
                            
                            {/* Submit Solution */}
                            <div className="mb-4">
                                <textarea
                                    value={newSolution}
                                    onChange={(e) => setNewSolution(e.target.value)}
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
                                {solutions.length === 0 ? (
                                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No solutions yet. Be the first!</p>
                                ) : (
                                    solutions.map(solution => (
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
                                                        onClick={() => handleRateSolution(solution.id)}
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