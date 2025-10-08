# Sudoku Game Backend

This is the backend server for the Sudoku game, built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (free tier available)
- Gmail account with App Password
- npm or yarn

## Setup

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Setup MongoDB Atlas:**
   - See [MONGODB_ATLAS_SETUP.md](../MONGODB_ATLAS_SETUP.md) for detailed instructions
   - Quick steps:
     1. Create free cluster at https://www.mongodb.com/cloud/atlas
     2. Create database user
     3. Whitelist IP (0.0.0.0/0 for development)
     4. Get connection string

3. **Setup Gmail App Password:**
   - Enable 2-Step Verification in Google Account
   - Generate App Password at https://myaccount.google.com/apppasswords
   - Copy the 16-character password

4. **Create `.env` file in server directory:**
   ```env
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Atlas Connection String
   MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/sudoku-game?retryWrites=true&w=majority
   
   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key_here
   
   # Gmail Configuration
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_16_char_app_password
   
   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```
   
   See `.env.example` for reference.

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   Server running on port 5000
   MongoDB connected ✅
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
