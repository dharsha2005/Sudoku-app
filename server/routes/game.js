const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendVictoryEmail } = require('../utils/emailService');

// @route   POST api/game/progress
// @desc    Save game progress
// @access  Private
router.post('/progress', protect, async (req, res) => {
  try {
    const { difficulty, time, moves, score, boardSize, isSamurai } = req.body;
    
    // Simple validation
    if (!difficulty || !time || !moves || !score || !boardSize) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // In a real app, you would save this to a GameProgress model
    // For now, we'll just return success
    
    res.status(200).json({
      success: true,
      message: 'Game progress saved successfully',
      data: {
        difficulty,
        time,
        moves,
        score,
        boardSize,
        isSamurai: isSamurai || false,
        savedAt: new Date()
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/game/victory
// @desc    Record a victory
// @access  Private
router.post('/victory', protect, async (req, res) => {
  try {
    const { difficulty, time } = req.body;
    
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({ message: 'Invalid difficulty level' });
    }
    
    if (typeof time !== 'number' || time <= 0) {
      return res.status(400).json({ message: 'Invalid time' });
    }
    
    const user = await User.findById(req.user.id);
    const oldBestTime = user.bestTimes[difficulty];
    const isNewRecord = !oldBestTime || time < oldBestTime;
    
    await user.addVictory(difficulty, time);
    
    // Send victory email (don't wait for it)
    if (user.email) {
      sendVictoryEmail(user.email, user.username, difficulty, time, isNewRecord).catch(err =>
        console.error('Failed to send victory email:', err)
      );
    }
    
    res.json({
      victories: user.victories,
      bestTimes: user.bestTimes,
      isNewRecord
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/game/leaderboard
// @desc    Get leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const { difficulty } = req.query;
    
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({ message: 'Invalid difficulty level' });
    }
    
    const users = await User.find({
      [`victories.${difficulty}`]: { $gt: 0 }
    })
    .sort({ [`victories.${difficulty}`]: -1 })
    .limit(10)
    .select('username victories bestTimes');
    
    res.json(users.map(user => ({
      username: user.username,
      victories: user.victories[difficulty],
      bestTime: user.bestTimes[difficulty]
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
