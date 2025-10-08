import React, { useState } from 'react';
import { login, register } from './services/api';
import './App.css';

function Login({ setUser }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { username, email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    
    if (!isLogin && !email.trim()) {
      setError('Please enter an email');
      return;
    }
    
    if (!isLogin && !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }
    
    if (!password) {
      setError('Please enter a password');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Handle login
        const data = await login(username, password);
        setUser(data.user);
      } else {
        // Handle registration
        const data = await register(username, email, password);
        setError('Registration successful! Please log in.');
        setIsLogin(true); // Switch to login form after successful registration
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div className="login-container fade-in">
      <div className="login-box">
        <h2>{isLogin ? 'Welcome Back to Sudoku Master' : 'Create an Account'}</h2>
        <p className="login-subtitle">
          {isLogin ? 'Please sign in to continue' : 'Create your account to save your progress'}
        </p>
        
        {error && (
          <div className={`message ${isLogin ? 'error-message' : 'success-message'}`}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              value={username}
              onChange={handleChange}
              onFocus={() => setError('')}
              placeholder="Enter your username"
              className="form-input"
              autoComplete="username"
              disabled={isLoading}
            />
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                onFocus={() => setError('')}
                placeholder="Enter your email"
                className="form-input"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              onFocus={() => setError('')}
              placeholder="Enter your password"
              className="form-input"
              autoComplete={isLogin ? "current-password" : "new-password"}
              disabled={isLoading}
            />
            {!isLogin && (
              <small className="password-hint">
                Password must be at least 6 characters long
              </small>
            )}
          </div>
          
          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner"></span>
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Sign Up'
            )}
          </button>
          
          <div className="auth-toggle">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button 
              type="button" 
              className="text-button" 
              onClick={toggleAuthMode}
              disabled={isLoading}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
          
          {isLogin && (
            <div className="forgot-password">
              <button type="button" className="text-button">
                Forgot password?
              </button>
            </div>
          )}
        </form>
        
        <div className="demo-credentials">
          <p>Demo credentials:</p>
          <p>Username: <strong>demo</strong></p>
          <p>Password: <strong>any</strong></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
