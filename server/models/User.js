const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [20, 'Username cannot be more than 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  victories: {
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 }
  },
  bestTimes: {
    easy: { type: Number, default: null },
    medium: { type: Number, default: null },
    hard: { type: Number, default: null }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, username: this.username },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update victory count
userSchema.methods.addVictory = async function(difficulty, time) {
  this.victories[difficulty] = (this.victories[difficulty] || 0) + 1;
  
  // Update best time if current time is better or no best time exists
  if (!this.bestTimes[difficulty] || time < this.bestTimes[difficulty]) {
    this.bestTimes[difficulty] = time;
  }
  
  await this.save();
  return this;
};

module.exports = mongoose.model('User', userSchema);
