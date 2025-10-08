# 🎮 Sudoku Master

A modern full-stack Sudoku gaming application with beautiful UI, user authentication, email notifications, and complete gaming features.

## ✨ Features

### 🔐 Authentication System
- Secure user registration with email validation
- JWT-based authentication
- Password hashing with bcryptjs
- Session persistence
- Welcome emails on registration

### 🎯 Gaming Features
- Multiple Sudoku variants (Classic 9x9, Samurai)
- Three difficulty levels (Easy, Medium, Hard)
- Real-time game timer
- Move tracking and scoring system
- Victory celebration with animations
- Personal best times tracking
- Level progression system
- Global leaderboard

### 📧 Email Notifications
- Beautiful HTML welcome emails
- Victory celebration emails
- Personal record notifications
- Responsive email templates

### 🎨 Stunning UI/UX
- Modern gaming aesthetic with gradients and glow effects
- Smooth animations and transitions
- Dark purple theme with neon accents
- Responsive design (mobile-friendly)
- Interactive game board with hover effects
- Victory modal with celebration effects
- Custom fonts (Orbitron & Poppins)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Gmail account (for email notifications) or other SMTP service
- npm or yarn

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and configure it:

```bash
cd server
copy .env.example .env    # Windows
# OR
cp .env.example .env      # macOS/Linux
```

Edit `server/.env` with your credentials:

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/sudoku-game
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sudoku-game

# JWT Secret (Change this!)
JWT_SECRET=your_super_secret_jwt_key_here

# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Important:** For Gmail, you need to generate an App Password:
1. Go to https://myaccount.google.com/apppasswords
2. Generate a new app password
3. Use that password in `EMAIL_PASSWORD`

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
npm start
# App opens at http://localhost:3000
```

## 📱 How to Use

1. **Register an Account:**
   - Enter your username, email, and password
   - Receive a beautiful welcome email
   - Get automatically logged in

2. **Play Sudoku:**
   - Select your preferred difficulty level
   - Choose between Classic or Samurai mode
   - Click on cells to enter numbers (1-9)
   - Timer starts automatically
   - Complete the puzzle to win!

3. **Track Your Progress:**
   - View your victories for each difficulty
   - Check your best completion times
   - Compete on the global leaderboard

4. **Receive Notifications:**
   - Get victory celebration emails
   - Receive alerts for new personal records

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm test`

Launches the test runner in interactive watch mode.

## Project Structure

```
sudoku-uid/
├── public/              # Static files
├── server/              # Backend server
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   └── server.js        # Server entry point
├── src/
│   ├── components/      # React components
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   ├── App.js           # Main App component
│   └── index.js         # React entry point
├── .env                 # Frontend environment variables
└── package.json         # Project dependencies and scripts
```

## 🛠️ Technologies Used

### Frontend
- **React 19** - UI library
- **React Hooks** - State management
- **CSS3** - Styling with animations
- **Fetch API** - HTTP requests
- **Local Storage** - Session persistence

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Nodemailer** - Email service
- **Bcryptjs** - Password hashing
- **Validator** - Input validation

### DevOps
- **Nodemon** - Development server
- **Morgan** - HTTP logger
- **CORS** - Cross-origin resource sharing

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Game
- `POST /api/game/victory` - Record game victory (protected)
- `POST /api/game/progress` - Save game progress (protected)
- `GET /api/game/leaderboard` - Get leaderboard by difficulty

## 🎨 UI Screenshots

The application features:
- Gradient purple/pink color scheme
- Neon glow effects on interactive elements
- Smooth hover and click animations
- Responsive design for all screen sizes
- Victory celebration modals
- Modern gaming aesthetic

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally
- For Atlas, check IP whitelist settings
- Verify connection string in `.env`

### Email Not Sending
- Verify Gmail App Password is correct
- Check 2-Step Verification is enabled
- Review server console for errors

### Frontend Can't Connect
- Ensure backend is running on port 5000
- Check CORS settings
- Verify API_BASE_URL in `src/services/api.js`

## 📝 Future Enhancements

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Social authentication (Google, Facebook)
- [ ] Multiplayer mode
- [ ] Daily challenges
- [ ] Achievement system
- [ ] Dark/Light theme toggle
- [ ] Hints system
- [ ] Undo/Redo functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🎉 Enjoy Playing!

Built with ❤️ using React, Node.js, and MongoDB
"# Sudoku-app" 
