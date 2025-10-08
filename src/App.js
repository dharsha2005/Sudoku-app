import React, { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import { getCurrentUser, logout as apiLogout } from './services/api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sudoku Master</h1>
        {user && (
          <button 
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button>
        )}
      </header>
      
      <main className="main-content">
        {!user ? (
          <Login setUser={setUser} />
        ) : (
          <Dashboard 
            user={user} 
            onVictory={(result) => {
              // Update user stats after victory
              setUser(prevUser => ({
                ...prevUser,
                victories: result.victories,
                bestTimes: result.bestTimes
              }));
            }}
          />
        )}
      </main>
      
      <footer className="App-footer">
        <p>© {new Date().getFullYear()} Sudoku Master - Created with React</p>
      </footer>
    </div>
  );
}

export default App;
