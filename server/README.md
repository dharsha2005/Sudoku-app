# Sudoku Game Backend

This is the backend server for the Sudoku game, built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Setup

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/sudoku-game
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
  ```json
  {
    "username": "testuser",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "username": "testuser",
    "password": "password123"
  }
  ```

- `GET /api/auth/me` - Get current user (requires authentication)

### Game
- `POST /api/game/victory` - Record a victory
  ```json
  {
    "difficulty": "easy",
    "time": 120
  }
  ```

- `GET /api/game/leaderboard?difficulty=easy` - Get leaderboard for a difficulty level

## Database Schema

### User
```javascript
{
  username: String,
  password: String,
  victories: {
    easy: Number,
    medium: Number,
    hard: Number
  },
  bestTimes: {
    easy: Number,
    medium: Number,
    hard: Number
  },
  createdAt: Date
}
```
