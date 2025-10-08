import React, { useState, useEffect, useCallback, useRef } from 'react';
import './SudokuBoard.css';
import { generateSudokuPuzzle, isPuzzleSolved } from './utils/sudokuGenerator';
import { saveGameProgress } from './services/api';

function SudokuBoard({
    size,
    regions = Math.sqrt(size),
    regionRows,
    regionCols,
    isSamurai = false,
    difficulty = 'medium',
    level = 1,
    onComplete
}) {
    // Ensure difficulty is always one of 'easy', 'medium', or 'hard'
    const normalizedDifficulty = ['easy', 'medium', 'hard'].includes(difficulty.toLowerCase())
        ? difficulty.toLowerCase()
        : 'medium';

    // Use the level from props, default to 1 if not provided
    const [currentLevel, setCurrentLevel] = useState(level || 1);
    const [board, setBoard] = useState([]);
    const [initialBoard, setInitialBoard] = useState([]);
    const [solution, setSolution] = useState([]);
    const [isValid, setIsValid] = useState(true);
    const [isComplete, setIsComplete] = useState(false);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [hintUsed, setHintUsed] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [errorCells, setErrorCells] = useState(new Set());

    const timerRef = useRef(null);
    const startTimeRef = useRef(null);

    // Calculate region dimensions if not provided
    const regionWidth = regionCols || regions;
    const regionHeight = regionRows || regions;

    // Timer effect - Start automatically when board is loaded
    useEffect(() => {
        // Only start timer once the board is loaded
        if (!board || board.length === 0) return;

        if (isComplete || isPaused) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            return;
        }

        // Start timer automatically
        if (!timerRef.current) {
            timerRef.current = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [isComplete, isPaused, board]);

    // Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate score based on difficulty, time, and moves
    const calculateScore = (difficulty, time, moves, hintUsed) => {
        let baseScore = 0;

        // Base points based on difficulty
        switch (difficulty) {
            case 'easy': baseScore = 100; break;
            case 'medium': baseScore = 250; break;
            case 'hard': baseScore = 500; break;
            case 'expert': baseScore = 1000; break;
            default: baseScore = 100;
        }

        // Time bonus (faster is better)
        const timeBonus = Math.max(0, 300 - time) * 2; // Max 10 minutes

        // Move penalty (fewer moves is better)
        const movePenalty = Math.min(50, moves * 2);

        // Hint penalty
        const hintPenalty = hintUsed ? 50 : 0;

        return baseScore + timeBonus - movePenalty - hintPenalty;
    };

    // Generate a new puzzle
    const generatePuzzle = useCallback(() => {
        try {
            // Reset completion state
            setIsComplete(false);

            // Generate new puzzle based on the current configuration
            const { puzzle, solution } = generateSudokuPuzzle(
                size,
                normalizedDifficulty,
                regionHeight,
                regionWidth
            );

            // Update state with the new puzzle
            setBoard(JSON.parse(JSON.stringify(puzzle)));
            setInitialBoard(JSON.parse(JSON.stringify(puzzle)));
            setSolution(JSON.parse(JSON.stringify(solution)));
            setMoves(0);
            setTimeElapsed(0);
            setHintUsed(false);
            setIsValid(true);
            setErrorCells(new Set());

            // Reset timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }

            // Start the timer
            startTimeRef.current = Date.now();

            return { puzzle, solution };
        } catch (error) {
            console.error('Error generating puzzle:', error);
            // Fallback to a default puzzle if generation fails
            const emptyPuzzle = Array(size).fill().map(() => Array(size).fill(''));
            return { puzzle: emptyPuzzle, solution: emptyPuzzle };
        }
    }, [size, normalizedDifficulty, regionHeight, regionWidth]);

    // Reset the board to initial state
    const resetBoard = useCallback(() => {
        generatePuzzle();
        setIsValid(true);
        setIsComplete(false);
    }, [generatePuzzle]);

    // Initialize the board
    useEffect(() => {
        // Reset the board when any of these props change
        resetBoard();

        // Cleanup timer on unmount
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [size, regions, regionWidth, regionHeight, normalizedDifficulty, resetBoard]);

    // Check if the current board is valid
    const validateBoard = useCallback((boardToValidate) => {
        // Check rows and columns
        for (let i = 0; i < size; i++) {
            const row = new Set();
            const col = new Set();

            for (let j = 0; j < size; j++) {
                // Check row
                if (boardToValidate[i][j] !== '') {
                    if (row.has(boardToValidate[i][j])) return false;
                    row.add(boardToValidate[i][j]);
                }

                // Check column
                if (boardToValidate[j][i] !== '') {
                    if (col.has(boardToValidate[j][i])) return false;
                    col.add(boardToValidate[j][i]);
                }
            }
        }

        // Check regions
        for (let boxRow = 0; boxRow < regionHeight; boxRow++) {
            for (let boxCol = 0; boxCol < regionWidth; boxCol++) {
                const region = new Set();

                for (let i = 0; i < regionHeight; i++) {
                    for (let j = 0; j < regionWidth; j++) {
                        const row = boxRow * regionHeight + i;
                        const col = boxCol * regionWidth + j;
                        const value = boardToValidate[row]?.[col];

                        if (value !== '') {
                            if (region.has(value)) return false;
                            region.add(value);
                        }
                    }
                }
            }
        }

        return true;
    }, [size, regionHeight, regionWidth]);

    // Check if the board is complete
    // Check if the board is complete
    useEffect(() => {
        if (board.length === 0 || board[0].length === 0 || !solution) return;

        // Skip validation if the game is already complete
        if (isComplete) return;

        // Check if the board is completely filled
        const isFilled = board.every(row =>
            row.every(cell => cell !== '')
        );

        if (!isFilled) return;

        // Validate the board
        const isValidBoard = validateBoard(board);

        if (isValidBoard) {
            // Mark as complete
            setIsComplete(true);

            // Stop the timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }

            // Calculate final score
            const finalScore = calculateScore(normalizedDifficulty, timeElapsed, moves, hintUsed);
            setScore(finalScore);

            // Prepare completion data
            const completionData = {
                time: timeElapsed,
                difficulty: normalizedDifficulty,
                level: currentLevel,
                score: finalScore,
                moves,
                isSamurai,
                boardSize: size
            };

            // Notify parent component of victory with all relevant data
            if (onComplete) {
                onComplete(completionData);
            }

            // Save game progress (don't await to avoid blocking UI)
            saveGameProgress(completionData)
                .then(result => {
                    if (!result.success) {
                        console.log('Game progress not saved:', result.message);
                    } else {
                        console.log('Game progress saved successfully');
                    }
                })
                .catch(error => {
                    console.error('Error saving game progress:', error);
                });

            // Increment level for the next game
            setCurrentLevel(prevLevel => prevLevel + 1);
        }
    }, [board, normalizedDifficulty, timeElapsed, moves, hintUsed, currentLevel, size, isSamurai, onComplete, solution, isComplete, validateBoard]);

    // Check for conflicts in real-time
    const getConflicts = useCallback((b, row, col, value) => {
        const conflicts = new Set();
        if (!value || value === '') return conflicts;

        // Check row for duplicates
        for (let c = 0; c < size; c++) {
            if (c !== col && b[row][c] === value) {
                conflicts.add(`${row}-${col}`);
                break;
            }
        }

        // Check column for duplicates
        for (let r = 0; r < size; r++) {
            if (r !== row && b[r][col] === value) {
                conflicts.add(`${row}-${col}`);
                break;
            }
        }

        // Check region for duplicates
        const regionRow = Math.floor(row / regionHeight) * regionHeight;
        const regionCol = Math.floor(col / regionWidth) * regionWidth;

        for (let i = 0; i < regionHeight; i++) {
            for (let j = 0; j < regionWidth; j++) {
                const r = regionRow + i;
                const c = regionCol + j;
                if ((r !== row || c !== col) && b[r][c] === value) {
                    conflicts.add(`${row}-${col}`);
                    break;
                }
            }
        }

        // Check against solution if we want to show wrong answers
        if (solution && solution[row] && solution[row][col] && value !== solution[row][col]) {
            conflicts.add(`${row}-${col}`);
        }

        return conflicts;
    }, [size, regionHeight, regionWidth, solution]);

    // Handle cell input change
    const handleInputChange = (row, col, value) => {
        // Only allow numbers 1-size or empty string
        const validInput = value === '' ||
            (parseInt(value) >= 1 && parseInt(value) <= size);

        if (!validInput || initialBoard[row][col] !== '') return;

        const newBoard = board.map((r, i) =>
            r.map((cell, j) => (i === row && j === col ? value : cell))
        );

        setBoard(newBoard);
        setMoves(prevMoves => prevMoves + 1);

        // Check for conflicts in real-time
        const conflicts = getConflicts(newBoard, row, col, value);

        if (conflicts.size > 0 && value !== '') {
            // Show error but allow immediate correction
            setErrorCells(conflicts);
            setIsValid(false);

            // Remove error highlight after 1.5 seconds
            const timeoutId = setTimeout(() => {
                setErrorCells(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(`${row}-${col}`);
                    return newSet;
                });
            }, 1500);

            // Store timeout ID to clear if user types again
            return () => clearTimeout(timeoutId);
        } else {
            // Clear any existing errors for this cell immediately
            setErrorCells(prev => {
                const newSet = new Set(prev);
                newSet.delete(`${row}-${col}`);
                return newSet;
            });
            
            // Validate the entire board
            const isValidBoard = validateBoard(newBoard);
            setIsValid(isValidBoard);
        }

        // Check if the board is complete
        const isPuzzleComplete = isPuzzleSolved(newBoard);
        setIsComplete(isPuzzleComplete);

        // Auto-save progress
        if (!isPuzzleComplete) {
            const gameData = {
                difficulty: difficulty || 'medium', // Ensure difficulty is always set
                time: timeElapsed,
                moves: moves + 1,
                score: score || 0, // Ensure score is always a number
                boardSize: size,
                isSamurai: isSamurai || false, // Ensure isSamurai is always a boolean
                level: level || 1 // Ensure level is always a number
            };

            // Only include board and initialBoard if they're not too large
            if (JSON.stringify(newBoard).length < 1000) {
                gameData.board = newBoard;
            }

            saveGameProgress(gameData).catch(console.error);
        }
    };

    // Get a hint
    const getHint = () => {
        // Find an empty cell
        const emptyCells = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i][j] === '' && initialBoard[i][j] === '') {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }

        if (emptyCells.length > 0) {
            // Pick a random empty cell
            const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

            // Fill in the correct value
            const newBoard = board.map((r, i) =>
                r.map((cell, j) => (i === row && j === col ? solution[row][col] : cell))
            );

            setBoard(newBoard);
            setHintUsed(true);

            // Check if the board is complete with the hint
            const isPuzzleComplete = isPuzzleSolved(newBoard, solution);
            setIsComplete(isPuzzleComplete);
        }
    };

    // Toggle pause
    const togglePause = () => {
        setIsPaused(!isPaused);
        if (isPaused) {
            // Resume timer
            timerRef.current = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
            }, 1000);
        } else {
            // Pause timer
            clearInterval(timerRef.current);
        }
    };

    // Reset the game
    const resetGame = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setTimeElapsed(0);
        setMoves(0);
        setHintUsed(false);
        setErrorCells(new Set());
        setIsValid(true);
        generatePuzzle();
    };

    // Solve the board
    const solveBoard = () => {
        if (window.confirm('Are you sure you want to solve the puzzle? This will end the current game.')) {
            setBoard(JSON.parse(JSON.stringify(solution)));
            setIsComplete(true);
            clearInterval(timerRef.current);
        }
    };

    // Get cell class based on position and state
    const getCellClass = (row, col) => {
        const classes = ['sudoku-cell'];

        // Add region borders
        if (row % regionHeight === 0) classes.push('region-top');
        if (col % regionWidth === 0) classes.push('region-left');
        if ((row + 1) % regionHeight === 0) classes.push('region-bottom');
        if ((col + 1) % regionWidth === 0) classes.push('region-right');

        // Add samurai specific styling
        if (isSamurai) {
            const center = Math.floor(size / 2);
            const isCenter = row >= center - 3 && row <= center + 3 &&
                col >= center - 3 && col <= center + 3;
            if (isCenter) classes.push('center-grid');
        }

        return classes.join(' ');
    };

    // Calculate cell font size based on grid size
    const getCellStyle = () => {
        if (size <= 9) return { fontSize: '20px' };
        if (size <= 16) return { fontSize: '16px' };
        return { fontSize: '12px' };
    };

    return (
        <div className="sudoku-board-container">
            {/* Game Info Bar */}
            <div className="game-info">
                <div className="info-card">
                    <div className="info-label">⏱️ Time</div>
                    <div className="info-value">{formatTime(timeElapsed)}</div>
                </div>
                <div className="info-card">
                    <div className="info-label">🎯 Moves</div>
                    <div className="info-value">{moves}</div>
                </div>
                <div className="info-card">
                    <div className="info-label">📊 Level</div>
                    <div className="info-value">{currentLevel}</div>
                </div>
                <div className="info-card">
                    <div className="info-label">⭐ Score</div>
                    <div className="info-value">{score}</div>
                </div>
            </div>

            {/* Sudoku Grid */}
            <div className={`sudoku-grid size-${size}`}>
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        const isGiven = initialBoard[rowIndex] && initialBoard[rowIndex][colIndex] !== '';
                        const isFilled = !isGiven && cell !== '';
                        const cellKey = `${rowIndex}-${colIndex}`;
                        const hasError = errorCells.has(cellKey);

                        return (
                            <div
                                key={`cell-${rowIndex}-${colIndex}`}
                                className={`sudoku-cell ${isGiven ? 'given' : ''} ${isFilled ? 'filled' : ''} ${hasError ? 'error' : ''}`}
                                onClick={() => {
                                    if (!isGiven && !isComplete) {
                                        // Cell click handler - could be used for selection
                                    }
                                }}
                            >
                                {isGiven ? (
                                <span className="cell-number">{cell}</span>
                                ) : (
                                <input
                                type="text"
                                className="cell-input"
                                maxLength={1}
                                value={cell}
                                onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= size)) {
                                handleInputChange(rowIndex, colIndex, value);
                                }
                                }}
                                onKeyDown={(e) => {
                                // Allow backspace, delete, arrows
                                if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'].includes(e.key)) {
                                return;
                                }
                                // Only allow numbers 1-9
                                if (!/^[1-9]$/.test(e.key)) {
                                e.preventDefault();
                                }
                                }}
                                disabled={isComplete || isPaused}
                                    autoFocus={false}
                                    />
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Game Controls */}
            <div className="game-controls">
                <button
                    onClick={resetGame}
                    className="game-button"
                >
                    🔄 New Game
                </button>

                <button
                    onClick={togglePause}
                    className="game-button secondary"
                    disabled={isComplete}
                >
                    {isPaused ? '▶️ Resume' : '⏸️ Pause'}
                </button>

                <button
                    onClick={getHint}
                    className="game-button success"
                    disabled={isComplete || hintUsed}
                    title={hintUsed ? 'Hint already used' : 'Get one hint per game'}
                >
                    💡 Hint
                </button>
            </div>

            {/* Victory Modal */}
            {isComplete && (
                <div className="victory-modal" onClick={() => resetGame()}>
                    <div className="victory-content" onClick={(e) => e.stopPropagation()}>
                        <div className="victory-emoji">🎉</div>
                        <h2>Victory!</h2>
                        <div className="victory-stats">
                            <div className="victory-stat">
                                <span className="victory-stat-label">Time</span>
                                <span className="victory-stat-value">{formatTime(timeElapsed)}</span>
                            </div>
                            <div className="victory-stat">
                                <span className="victory-stat-label">Moves</span>
                                <span className="victory-stat-value">{moves}</span>
                            </div>
                            <div className="victory-stat">
                                <span className="victory-stat-label">Score</span>
                                <span className="victory-stat-value">{score}</span>
                            </div>
                        </div>
                        <button onClick={resetGame} className="game-button">
                            🎮 Play Next Level
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SudokuBoard;
