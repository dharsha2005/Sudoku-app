require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');
const { errorHandler } = require('./middleware/auth');

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'https://sudoku-app-secf.onrender.com'
];

const corsOptions = {
<<<<<<< HEAD
  origin: (origin, callback) => {
    if (process.env.FRONTEND_URL === '*') {
      callback(null, true);
    } else if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
=======
  origin: process.env.FRONTEND_URL === '*' ? '*' : (process.env.FRONTEND_URL || 'https://sudoku-app-secf.onrender.com/'),
  credentials: process.env.FRONTEND_URL === '*' ? false : true
>>>>>>> b4c427c680e94f0e4dbfdf1163e860443793d6c8
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Sudoku API is running',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      game: '/api/game'
    },
    documentation: 'Check the API documentation for available endpoints'
  });
});

// Connect to MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://onlytamilan6_db_user:08-Aug-05@cluster0.irjjr71.mongodb.net/sudoku-uid?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
})
.then(() => console.log('MongoDB Atlas connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
