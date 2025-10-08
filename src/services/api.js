const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// User Authentication
export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Save token to localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    // Save token to localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      // If token is invalid, remove it
      if (response.status === 401) {
        localStorage.removeItem('token');
      }
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
};

// Game Victory
export const recordVictory = async (difficulty, time) => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/victory`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ difficulty, time }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to record victory');
    }
    
    return data;
  } catch (error) {
    console.error('Record victory error:', error);
    throw error;
  }
};

// Game Progress
export const saveGameProgress = async (gameState) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No auth token found, skipping game progress save');
      return { success: false, message: 'Not authenticated' };
    }

    console.log('Saving game progress:', gameState);
    const response = await fetch(`${API_BASE_URL}/game/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(gameState),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Failed to save game progress:', data);
      throw new Error(data.message || 'Failed to save game progress');
    }
    
    console.log('Game progress saved successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in saveGameProgress:', error);
    // Don't throw the error to prevent breaking the game flow
    return { success: false, message: error.message };
  }
};

export const getGameProgress = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/progress/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch game progress');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching game progress:', error);
    throw error;
  }
};

// Leaderboard
export const updateLeaderboard = async (userId, score) => {
  try {
    const response = await fetch(`${API_BASE_URL}/leaderboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ userId, score }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update leaderboard');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    throw error;
  }
};

export const getLeaderboard = async (difficulty = 'easy') => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/leaderboard?difficulty=${difficulty}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};
