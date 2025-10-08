# Sudoku Master - Complete Setup Guide

## 🎮 Full-Stack Gaming Application with Authentication & Email Notifications

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Gmail account (for email notifications) or other SMTP service

## 📦 Installation

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (Free tier available)
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string

### 3. Email Configuration

#### For Gmail (Recommended for Development):
1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to Security → 2-Step Verification (enable if not already)
3. Navigate to Security → App passwords
4. Generate a new app password for "Mail"
5. Copy the generated password (16 characters)

#### For Other Email Services:
- Use your SMTP server details
- Update `EMAIL_HOST` and `EMAIL_PORT` in `.env`

### 4. Environment Variables

#### Backend Environment Variables:

Navigate to the `server` folder and copy `.env.example` to `.env`:

```bash
cd server
copy .env.example .env    # Windows
cp .env.example .env      # macOS/Linux
```

Edit `server/.env` file with your actual values:

```env
PORT=5000
NODE_ENV=development

# MongoDB - Choose one:
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/sudoku-game

# OR MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sudoku-game?retryWrites=true&w=majority

# JWT Secret - CHANGE THIS!
JWT_SECRET=your_very_secret_and_long_random_string_here

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## 🚀 Running the Application

### Start Backend Server:

```bash
cd server
npm run dev
# Server will run on http://localhost:5000
```

### Start Frontend (in a new terminal):

```bash
npm start
# Frontend will run on http://localhost:3000
```

## ✨ Features

### Authentication System
- ✅ User registration with email validation
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Session persistence
- ✅ Welcome email on registration

### Gaming Features
- ✅ Multiple Sudoku variants (Classic, Samurai)
- ✅ Three difficulty levels (Easy, Medium, Hard)
- ✅ Real-time timer
- ✅ Victory tracking
- ✅ Personal best times
- ✅ Level progression
- ✅ Leaderboard system

### Email Notifications
- ✅ Welcome email on registration
- ✅ Victory celebration emails
- ✅ Personal record notifications
- ✅ Beautiful HTML email templates

### UI/UX
- ✅ Modern gaming aesthetic design
- ✅ Gradient backgrounds and glow effects
- ✅ Smooth animations and transitions
- ✅ Responsive design (mobile-friendly)
- ✅ Interactive game board
- ✅ Victory modal with confetti effect

## 📱 Usage

1. **Register a New Account:**
   - Enter username, email, and password
   - Receive welcome email
   - Automatically logged in

2. **Play Sudoku:**
   - Select difficulty level
   - Choose Sudoku variant
   - Click cells to enter numbers
   - Use keyboard or on-screen number pad

3. **Track Progress:**
   - View victory counts per difficulty
   - See personal best times
   - Check leaderboard rankings

4. **Receive Notifications:**
   - Victory emails after completing puzzles
   - New record notifications

## 🔧 Troubleshooting

### MongoDB Connection Issues:
- Verify MongoDB is running: `mongod --version`
- Check connection string in `.env`
- For Atlas, ensure IP is whitelisted

### Email Not Sending:
- Verify Gmail app password is correct
- Check 2-Step Verification is enabled
- Review server console for error messages
- For development, emails might go to spam folder

### Frontend Cannot Connect to Backend:
- Ensure backend is running on port 5000
- Check CORS settings in `server/server.js`
- Verify API_BASE_URL in `src/services/api.js`

## 🗄️ Database Structure

### Users Collection:
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
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

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- HTTP-only cookie support
- Input validation
- Email validation
- XSS protection
- CORS enabled

## 🎨 Technologies Used

### Frontend:
- React 19
- React Hooks
- CSS3 with animations
- Fetch API
- Local Storage

### Backend:
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Nodemailer for emails
- Bcryptjs for password hashing

## 📝 API Endpoints

### Authentication:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Game:
- `POST /api/game/victory` - Record victory
- `POST /api/game/progress` - Save game progress
- `GET /api/game/leaderboard?difficulty=easy` - Get leaderboard

## 🎯 Next Steps

1. Test the complete authentication flow
2. Play a game and verify victory tracking
3. Check your email for notifications
4. Customize the design as needed
5. Deploy to production (Heroku, Vercel, etc.)

## 📧 Support

If you encounter any issues:
1. Check server console for errors
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Ensure MongoDB is running
5. Check email service credentials

## 🎉 Enjoy Playing Sudoku Master!

Your complete full-stack gaming application is ready with:
- ✅ Beautiful gaming UI
- ✅ Secure authentication
- ✅ MongoDB database integration
- ✅ Email notifications
- ✅ Complete gaming features
- ✅ Responsive design

Happy Gaming! 🎮
