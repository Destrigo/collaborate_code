// StormBrainer API Service
const API_BASE_URL = 'https://stormbrainer-galaxy.onrender.com/api';

interface User {
  id: number;
  username: string;
  email?: string;
  rating: number;
}

interface Galaxy {
  id: number;
  name: string;
  description: string;
  category: string;
  is_public: boolean;
  owner_id: number;
  owner_username: string;
  is_member?: boolean;
}

interface Problem {
  id: number;
  title: string;
  description: string;
  galaxy_id: number;
  stars?: number;
}

interface Solution {
  id: number;
  text: string;
  problem_id: number;
  author_id: number;
  author_username: string;
  stars: number;
}

interface LeaderboardUser {
  id: number;
  username: string;
  rating: number;
  rank: number;
}

// Helper function to create fetch requests with JWT authentication
const apiFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    (defaultHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: defaultHeaders,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.statusText}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
};

// --- Authentication ---
export const login = async (username: string, password: string): Promise<{ user: User; token: string }> => {
  const response = await apiFetch<{ user: User; token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  if (response.token) {
    localStorage.setItem('token', response.token);
  }
  return response;
};

export const register = async (username: string, password: string): Promise<{ user: User; token: string }> => {
  const response = await apiFetch<{ user: User; token: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  if (response.token) {
    localStorage.setItem('token', response.token);
  }
  return response;
};

export const getCurrentUser = async (): Promise<User> => {
  return apiFetch<User>('/auth/me');
};

// --- Galaxies ---
export const getGalaxies = async (filter: string = 'public'): Promise<Galaxy[]> => {
  return apiFetch<Galaxy[]>(`/galaxies?filter=${filter}`);
};

export const createGalaxy = async (data: {
  name: string;
  description: string;
  category: string;
  is_public: boolean;
  password?: string;
}): Promise<Galaxy> => {
  return apiFetch<Galaxy>('/galaxies', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const joinGalaxy = async (galaxyId: number, password?: string): Promise<void> => {
  return apiFetch<void>(`/galaxies/${galaxyId}/join`, {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
};

// --- Problems ---
export const getProblems = async (galaxyId: number): Promise<Problem[]> => {
  return apiFetch<Problem[]>(`/galaxies/${galaxyId}/problems`);
};

export const createProblem = async (galaxyId: number, title: string, description: string): Promise<Problem> => {
  return apiFetch<Problem>(`/galaxies/${galaxyId}/problems`, {
    method: 'POST',
    body: JSON.stringify({ title, description }),
  });
};

// --- Solutions ---
export const getSolutions = async (problemId: number): Promise<Solution[]> => {
  return apiFetch<Solution[]>(`/problems/${problemId}/solutions`);
};

export const createSolution = async (problemId: number, text: string): Promise<Solution> => {
  return apiFetch<Solution>(`/problems/${problemId}/solutions`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
};

export const rateSolution = async (solutionId: number, value: number): Promise<Solution> => {
  return apiFetch<Solution>(`/solutions/${solutionId}/rate`, {
    method: 'POST',
    body: JSON.stringify({ value }),
  });
};

// --- Leaderboard ---
export const getLeaderboardData = async (): Promise<LeaderboardUser[]> => {
  return apiFetch<LeaderboardUser[]>('/leaderboard');
};

// --- Categories (mock) ---
export const getCategories = (): string[] => {
  return ['Math', 'Logic', 'Programming', 'Riddles', 'General'];
};

// Export types
export type { User, Galaxy, Problem, Solution, LeaderboardUser };
