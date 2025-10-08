// Helper function to create an empty grid
const createEmptyGrid = (size) => {
  return Array(size).fill().map(() => Array(size).fill(''));
};

// Check if a number can be placed in a cell
const isValidPlacement = (grid, row, col, num, size, regionHeight, regionWidth) => {
  // Check row
  for (let x = 0; x < size; x++) {
    if (grid[row][x] === num) return false;
  }
  
  // Check column
  for (let x = 0; x < size; x++) {
    if (grid[x][col] === num) return false;
  }
  
  // Check region
  const regionStartRow = row - (row % regionHeight);
  const regionStartCol = col - (col % regionWidth);
  
  for (let i = 0; i < regionHeight; i++) {
    for (let j = 0; j < regionWidth; j++) {
      if (grid[regionStartRow + i][regionStartCol + j] === num) {
        return false;
      }
    }
  }
  
  return true;
};

// Solve the Sudoku puzzle
const solveSudoku = (grid, size, regionHeight, regionWidth) => {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === '') {
        // Try all possible numbers
        const numbers = Array.from({ length: size }, (_, i) => (i + 1).toString());
        // Shuffle numbers for randomness
        for (let i = numbers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        
        for (const num of numbers) {
          if (isValidPlacement(grid, row, col, num, size, regionHeight, regionWidth)) {
            grid[row][col] = num;
            
            if (solveSudoku(grid, size, regionHeight, regionWidth)) {
              return true;
            }
            
            grid[row][col] = ''; // Backtrack
          }
        }
        return false; // Trigger backtracking
      }
    }
  }
  return true; // Puzzle solved
};

// Remove numbers to create a puzzle
const removeNumbers = (grid, cellsToRemove) => {
  const size = grid.length;
  const puzzle = JSON.parse(JSON.stringify(grid));
  let removed = 0;
  
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    
    if (puzzle[row][col] !== '') {
      puzzle[row][col] = '';
      removed++;
    }
  }
  
  return puzzle;
};

// Generate a new Sudoku puzzle
export const generateSudokuPuzzle = (size, difficulty = 'medium', regionRows, regionCols) => {
  const regionHeight = regionRows || Math.sqrt(size);
  const regionWidth = regionCols || Math.sqrt(size);
  
  // Create a solved Sudoku grid
  const solvedGrid = createEmptyGrid(size);
  solveSudoku(solvedGrid, size, regionHeight, regionWidth);
  
  // Determine number of cells to remove based on difficulty
  let cellsToRemove;
  switch (difficulty) {
    case 'easy':
      cellsToRemove = Math.floor(size * size * 0.4); // 40% empty
      break;
    case 'hard':
      cellsToRemove = Math.floor(size * size * 0.7); // 70% empty
      break;
    case 'expert':
      cellsToRemove = Math.floor(size * size * 0.8); // 80% empty
      break;
    case 'medium':
    default:
      cellsToRemove = Math.floor(size * size * 0.55); // 55% empty
  }
  
  // Create the puzzle by removing numbers
  const puzzle = removeNumbers(solvedGrid, cellsToRemove);
  
  return {
    puzzle,
    solution: solvedGrid,
    difficulty,
    size,
    regionHeight,
    regionWidth
  };
};

// Check if the puzzle is solved correctly
export const isPuzzleSolved = (puzzle, solution) => {
  if (!puzzle || !solution) return false;
  
  for (let i = 0; i < puzzle.length; i++) {
    for (let j = 0; j < puzzle[i].length; j++) {
      if (puzzle[i][j] !== solution[i][j]) {
        return false;
      }
    }
  }
  
  return true;
};
