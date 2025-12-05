// frontend/src/utils/helpers.js

/**
 * Formats a date string into a more readable format.
 * @param {string} dateString
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Simple debounce function to limit the rate of API calls during input.
 * @param {Function} func The function to debounce.
 * @param {number} delay The delay in milliseconds.
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

/**
 * Calculates a simple visual size factor for problem planets based on solution count.
 * @param {number} solutionCount
 * @returns {number} A scale factor (e.g., 1.0 to 1.5)
 */
export const calculatePlanetScale = (solutionCount) => {
    const minScale = 1.0;
    const maxScale = 1.5;
    const maxSolutions = 30; // Cap solutions that affect size
    
    // Linearly interpolate between minScale and maxScale
    const factor = Math.min(solutionCount, maxSolutions) / maxSolutions;
    return minScale + (maxScale - minScale) * factor;
};