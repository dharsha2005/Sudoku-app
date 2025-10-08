import React, { useState, useEffect } from 'react';
import SudokuBoard from './SudokuBoard';
import SudokuTypeSelector, { sudokuTypes } from './SudokuTypeSelector';
import { recordVictory, getLeaderboard } from './services/api';
import './App.css';

function Dashboard({ user, onVictory }) {
    const [selectedType, setSelectedType] = useState(sudokuTypes[2]); // Default to 9x9 Classic Sudoku
    const [selectedDifficulty, setSelectedDifficulty] = useState('easy'); // Default to easy difficulty
    const [stats, setStats] = useState({
        victories: { easy: 0, medium: 0, hard: 0 },
        bestTimes: { easy: null, medium: null, hard: null }
    });
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load user stats from localStorage on component mount
    useEffect(() => {
        const loadUserStats = () => {
            if (!user) return;

            try {
                const savedStats = localStorage.getItem(`user_${user.id}_stats`);
                if (savedStats) {
                    const parsedStats = JSON.parse(savedStats);
                    setStats(prev => ({
                        victories: { ...prev.victories, ...(parsedStats.victories || {}) },
                        bestTimes: { ...prev.bestTimes, ...(parsedStats.bestTimes || {}) }
                    }));
                }
            } catch (error) {
                console.error('Error loading user stats:', error);
            }
        };

        loadUserStats();
    }, [user]);

    // Format time in seconds to MM:SS format
    const formatTime = (seconds) => {
        if (seconds === null || seconds === undefined) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Load leaderboard when component mounts or difficulty changes
    useEffect(() => {
        const loadLeaderboard = async () => {
            try {
                setIsLoading(true);
                const data = await getLeaderboard(selectedDifficulty);
                setLeaderboard(data);
            } catch (error) {
                console.error('Failed to load leaderboard:', error);
                // Set empty leaderboard on error
                setLeaderboard([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadLeaderboard();
    }, [selectedDifficulty]);

    // Handle game completion
    const handleGameComplete = async (gameResult) => {
        try {
            setIsLoading(true);
            const { time, difficulty = selectedDifficulty, level = 1 } = gameResult;

            // Update local state with the new victory
            setStats(prevStats => {
                const newVictories = {
                    ...prevStats.victories,
                    [difficulty]: (prevStats.victories[difficulty] || 0) + 1
                };

                const newBestTimes = {
                    ...prevStats.bestTimes,
                    [difficulty]: prevStats.bestTimes[difficulty]
                        ? Math.min(prevStats.bestTimes[difficulty], time)
                        : time
                };

                // Save to localStorage if user is logged in
                if (user) {
                    const statsToSave = {
                        victories: newVictories,
                        bestTimes: newBestTimes
                    };
                    localStorage.setItem(`user_${user.id}_stats`, JSON.stringify(statsToSave));
                }

                return {
                    victories: newVictories,
                    bestTimes: newBestTimes
                };
            });

            try {
                // Record the victory on the server
                const result = await recordVictory(difficulty, time);

                // Refresh leaderboard for the current difficulty
                const leaderboardData = await getLeaderboard(difficulty);
                setLeaderboard(leaderboardData);

                // Show success message with level completed
                alert(`Level ${level} completed in ${formatTime(time)}!`);

                // Notify parent component if needed
                if (onVictory) {
                    onVictory({
                        ...result,
                        level: level,
                        time: time,
                        difficulty: difficulty
                    });
                }
            } catch (error) {
                console.error('Error saving to server:', error);
                // Still show completion message even if server save fails
                alert(`Level ${level} completed in ${formatTime(time)}! (Offline mode)`);

                // Notify parent component in offline mode
                if (onVictory) {
                    onVictory({
                        level: level,
                        time: time,
                        difficulty: difficulty,
                        offline: true
                    });
                }
            }
        } catch (error) {
            console.error('Error recording victory:', error);
            // Still show completion message even if saving fails
            alert(`Level ${gameResult.level || 1} completed!`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTypeSelect = (type) => {
        setSelectedType(type);
    };

    // Load stats from localStorage on component mount
    useEffect(() => {
        if (user) {
            const savedVictories = localStorage.getItem(`user_${user.id}_victories`);
            const savedBestTimes = localStorage.getItem(`user_${user.id}_bestTimes`);

            if (savedVictories) {
                setStats(prev => ({
                    ...prev,
                    victories: JSON.parse(savedVictories)
                }));
            }

            if (savedBestTimes) {
                setStats(prev => ({
                    ...prev,
                    bestTimes: JSON.parse(savedBestTimes)
                }));
            }
        }
    }, [user]);

    const handleDifficultyChange = (e) => {
        setSelectedDifficulty(e.target.value);
    };

    return (
        <div className="dashboard">
            <div className="user-stats">
                <h2>Welcome, {user?.username || 'Player'}!</h2>

                {/* Difficulty Selector */}
                <div className="difficulty-selector">
                    <label htmlFor="difficulty">Difficulty: </label>
                    <select
                        id="difficulty"
                        value={selectedDifficulty}
                        onChange={handleDifficultyChange}
                        disabled={isLoading}
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>

                <div className="stats-container">
                    <div className="stat-box">
                        <h3>Victories</h3>
                        <div className="stat-row">
                            <span>Easy:</span>
                            <span className={selectedDifficulty === 'easy' ? 'highlight' : ''}>
                                {stats.victories.easy || 0}
                            </span>
                        </div>
                        <div className="stat-row">
                            <span>Medium:</span>
                            <span className={selectedDifficulty === 'medium' ? 'highlight' : ''}>
                                {stats.victories.medium || 0}
                            </span>
                        </div>
                        <div className="stat-row">
                            <span>Hard:</span>
                            <span className={selectedDifficulty === 'hard' ? 'highlight' : ''}>
                                {stats.victories.hard || 0}
                            </span>
                        </div>
                    </div>

                    <div className="stat-box">
                        <h3>Best Times</h3>
                        <div className="stat-row">
                            <span>Easy:</span>
                            <span className={selectedDifficulty === 'easy' ? 'highlight' : ''}>
                                {formatTime(stats.bestTimes.easy)}
                            </span>
                        </div>
                        <div className="stat-row">
                            <span>Medium:</span>
                            <span className={selectedDifficulty === 'medium' ? 'highlight' : ''}>
                                {formatTime(stats.bestTimes.medium)}
                            </span>
                        </div>
                        <div className="stat-row">
                            <span>Hard:</span>
                            <span className={selectedDifficulty === 'hard' ? 'highlight' : ''}>
                                {formatTime(stats.bestTimes.hard)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <SudokuTypeSelector
                onSelect={handleTypeSelect}
                selectedType={selectedType.id}
            />

            <div className="sudoku-game-container">
                <h3>{selectedType.name}</h3>

                {selectedType.isSamurai ? (
                    <div className="samurai-container">
                        {/* Top Grid */}
                        <div className="samurai-grid top">
                            <SudokuBoard
                                size={9}
                                regions={3}
                                isSamurai={true}
                                difficulty={selectedDifficulty}
                            />
                        </div>

                        {/* Middle Row */}
                        <div className="samurai-middle">
                            {/* Left Grid */}
                            <div className="samurai-grid left">
                                <SudokuBoard
                                    size={9}
                                    regions={3}
                                    isSamurai={true}
                                    onComplete={handleGameComplete}
                                    difficulty={selectedDifficulty}
                                />
                            </div>

                            {/* Center Grid */}
                            <div className="samurai-grid center">
                                <SudokuBoard
                                    size={9}
                                    regions={3}
                                    isSamurai={true}
                                    onComplete={handleGameComplete}
                                    difficulty={selectedDifficulty}
                                />
                            </div>

                            {/* Right Grid */}
                            <div className="samurai-grid right">
                                <SudokuBoard
                                    size={9}
                                    regions={3}
                                    isSamurai={true}
                                    onComplete={handleGameComplete}
                                    difficulty={selectedDifficulty}
                                />
                            </div>
                        </div>

                        {/* Bottom Grid */}
                        <div className="samurai-grid bottom">
                            <SudokuBoard
                                size={9}
                                regions={3}
                                isSamurai={true}
                                onComplete={handleGameComplete}
                                difficulty={selectedDifficulty}
                            />
                        </div>
                    </div>
                ) : (
                    <SudokuBoard
                        size={selectedType.size}
                        regions={selectedType.regions}
                        regionRows={selectedType.regionRows}
                        regionCols={selectedType.regionCols}
                        isSamurai={false}
                        onComplete={handleGameComplete}
                        difficulty={selectedDifficulty}
                        level={stats.victories[selectedDifficulty] + 1 || 1}
                        userId={user?.id || null}
                    />
                )}
            </div>
        </div>
    );
}

export default Dashboard;
