# Sudoku Master - Agent Instructions

## Project Overview
Full-stack Sudoku gaming application with authentication, email notifications, and attractive gaming UI.

## Tech Stack

### Frontend
- React 19.1.1
- CSS3 with custom gaming design
- Fonts: Poppins (body), Orbitron (headings)
- Color Scheme: Dark purple theme with gradients

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Nodemailer for email notifications
- Bcryptjs for password hashing

## Commands

### Development
```bash
# Start frontend (from root)
npm start

# Start backend (from server folder)
cd server
npm run dev

# Install dependencies
npm install                    # Frontend
cd server && npm install       # Backend
```

### Testing
```bash
# No automated tests configured yet
# Manual testing required
```

### Build
```bash
npm run build                  # Production build
```

## Project Structure

```
sudoku-uid/
├── public/              # Static files
├── server/              # Backend
│   ├── models/          # MongoDB models (User.js)
│   ├── routes/          # API routes (auth.js, game.js)
│   ├── middleware/      # Express middleware (auth.js)
│   ├── utils/           # Utilities (emailService.js)
│   ├── .env            # Environment variables (DO NOT COMMIT)
│   ├── .env.example    # Environment template
│   └── server.js       # Server entry point
├── src/
│   ├── services/       # API services (api.js)
│   ├── utils/          # Utility functions (sudokuGenerator.js)
│   ├── App.js          # Main component
│   ├── Login.js        # Authentication component
│   ├── Dashboard.js    # Game dashboard
│   ├── SudokuBoard.js  # Game board component
│   ├── SudokuTypeSelector.js
│   ├── App.css         # Main styles
│   ├── SudokuBoard.css # Game styles
│   └── index.js        # Entry point
└── package.json        # Dependencies
```

## Environment Variables

### Backend (.env in server folder)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `EMAIL_SERVICE` - Email service (gmail)
- `EMAIL_USER` - Email account
- `EMAIL_PASSWORD` - Email password (app password for Gmail)
- `FRONTEND_URL` - Frontend URL (default: http://localhost:3000)
- `NODE_ENV` - Environment (development/production)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user (username, email, password)
- `POST /api/auth/login` - Login user (username, password)
- `GET /api/auth/me` - Get current user (requires auth)

### Game
- `POST /api/game/victory` - Record victory (difficulty, time)
- `POST /api/game/progress` - Save game progress
- `GET /api/game/leaderboard?difficulty=easy` - Get leaderboard

## Database Schema

### User Model
```javascript
{
  username: String (unique, 3-20 chars),
  email: String (unique, validated),
  password: String (hashed, min 6 chars),
  victories: {
    easy: Number,
    medium: Number,
    hard: Number
  },
  bestTimes: {
    easy: Number (seconds),
    medium: Number,
    hard: Number
  },
  createdAt: Date
}
```

## Code Style

### General
- Use ES6+ features
- Async/await for promises
- Error handling with try-catch
- Meaningful variable names

### React
- Functional components with hooks
- useState for local state
- useEffect for side effects
- Props validation implicit

### CSS
- Custom properties (CSS variables) in :root
- BEM-like naming for classes
- Mobile-first responsive design
- Animations for user feedback

### Colors
- Primary gradient: #667eea → #764ba2
- Secondary gradient: #f093fb → #f5576c
- Success gradient: #4facfe → #00f2fe
- Dark background: #0f0c29
- Dark card: #1a1636

## Common Tasks

### Adding New Features
1. Plan the feature (backend/frontend/both)
2. Update database models if needed
3. Create/update API endpoints
4. Update frontend components
5. Test thoroughly

### Email Notifications
- Use `sendWelcomeEmail(email, username)` for registration
- Use `sendVictoryEmail(email, username, difficulty, time, isNewRecord)` for victories
- Email service configured in server/utils/emailService.js

### Authentication
- JWT tokens stored in localStorage
- Protected routes use `protect` middleware
- Token includes user id and username
- Expires in 30 days

## Known Issues
- None currently

## Future Enhancements
- Password reset functionality
- Email verification
- Social authentication
- Multiplayer mode
- Daily challenges
- Achievement system

## Testing Checklist

### Before Deployment
- [ ] MongoDB connection working
- [ ] User registration with email
- [ ] User login
- [ ] Email notifications sending
- [ ] Game plays correctly
- [ ] Victory tracking works
- [ ] Leaderboard displays
- [ ] All difficulty levels work
- [ ] Responsive on mobile
- [ ] All animations smooth

## Deployment Notes

### Environment Setup
1. Set all production environment variables
2. Use strong JWT_SECRET
3. Configure production MongoDB (Atlas recommended)
4. Set up production email service
5. Update CORS settings for production domain

### MongoDB Atlas (Cloud Database)
- **IMPORTANT:** This project uses MongoDB Atlas (cloud), NOT local MongoDB
- Free tier: 512MB storage
- Setup guide: See MONGODB_ATLAS_SETUP.md for complete instructions
- Quick setup:
  1. Create cluster at https://www.mongodb.com/cloud/atlas
  2. Create database user (username + password)
  3. Whitelist all IPs: 0.0.0.0/0 (Network Access)
  4. Get connection string from "Connect" → "Connect your application"
  5. Format: mongodb+srv://username:password@cluster.xxxxx.mongodb.net/sudoku-game
- Use connection string in MONGODB_URI environment variable
- Can still use MongoDB Compass locally to connect to Atlas database

### Email (Gmail)
- Enable 2-Step Verification
- Generate App Password
- Use app password in EMAIL_PASSWORD

## Support
- Check server console for backend errors
- Check browser console for frontend errors
- Verify .env configuration
- Ensure MongoDB is running
