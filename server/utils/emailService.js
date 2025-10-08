const nodemailer = require('nodemailer');

const createTransporter = () => {
  // Use Gmail if credentials are provided, regardless of environment
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else {
    // Fallback: log only in development (don't send emails if no credentials)
    console.warn('No email credentials found. Emails will not be sent.');
    return null;
  }
};

const sendWelcomeEmail = async (email, username) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log('Email transporter not configured. Skipping welcome email.');
      return null;
    }

    const mailOptions = {
      from: `"Sudoku Master" <${process.env.EMAIL_USER || 'noreply@sudokumaster.com'}>`,
      to: email,
      subject: '🎮 Welcome to Sudoku Master!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 32px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
            .content { padding: 40px 30px; color: #333; }
            .content h2 { color: #667eea; margin-top: 0; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white !important; padding: 15px 40px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); }
            .features { background: #f8f9ff; padding: 20px; border-radius: 10px; margin: 20px 0; }
            .feature-item { padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
            .feature-item:last-child { border-bottom: none; }
            .footer { background: #f8f9ff; padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎮 Sudoku Master</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px;">Welcome to the Ultimate Sudoku Experience!</p>
            </div>
            <div class="content">
              <h2>Hi ${username}! 👋</h2>
              <p>Welcome to <strong>Sudoku Master</strong> - where puzzle-solving meets gaming excellence!</p>
              
              <p>Your account has been successfully created, and you're now ready to embark on an exciting Sudoku journey.</p>
              
              <div class="features">
                <div class="feature-item">🎯 <strong>Multiple Difficulty Levels</strong> - From Easy to Hard, challenge yourself!</div>
                <div class="feature-item">🏆 <strong>Track Your Progress</strong> - Monitor victories and best times</div>
                <div class="feature-item">⚡ <strong>Classic & Samurai Modes</strong> - Multiple game variants to master</div>
                <div class="feature-item">📊 <strong>Personal Statistics</strong> - View your gaming achievements</div>
                <div class="feature-item">🎮 <strong>Beautiful Gaming UI</strong> - Enjoy an immersive experience</div>
              </div>
              
              <p>Ready to start your Sudoku journey? Let's go!</p>
              
              <center>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">Start Playing Now! 🚀</a>
              </center>
              
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Happy gaming, and may you conquer all the puzzles! 🎉
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Sudoku Master. All rights reserved.</p>
              <p>You're receiving this email because you created an account at Sudoku Master.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

const sendVictoryEmail = async (email, username, difficulty, time, isNewRecord = false) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log('Email transporter not configured. Skipping victory email.');
      return null;
    }
    
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const timeFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const difficultyEmojis = {
      easy: '🟢',
      medium: '🟡',
      hard: '🔴'
    };

    const mailOptions = {
      from: `"Sudoku Master" <${process.env.EMAIL_USER || 'noreply@sudokumaster.com'}>`,
      to: email,
      subject: `🎉 ${isNewRecord ? 'New Personal Record!' : 'Victory!'} - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level Completed`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 40px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 40px; animation: bounce 1s infinite; }
            .content { padding: 40px 30px; color: #333; text-align: center; }
            .stats-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px; margin: 20px 0; box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3); }
            .stats-box h2 { margin: 0 0 20px 0; font-size: 28px; }
            .time-display { font-size: 48px; font-weight: bold; margin: 20px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
            .difficulty-badge { display: inline-block; padding: 10px 20px; background: rgba(255,255,255,0.2); border-radius: 20px; margin: 10px 0; font-size: 18px; }
            ${isNewRecord ? '.record-banner { background: #ffd700; color: #333; padding: 15px; font-size: 20px; font-weight: bold; margin: 20px 0; border-radius: 10px; box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4); }' : ''}
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white !important; padding: 15px 40px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); }
            .footer { background: #f8f9ff; padding: 20px; text-align: center; color: #666; font-size: 12px; }
            @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉</h1>
              <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: bold;">Congratulations ${username}!</p>
            </div>
            <div class="content">
              ${isNewRecord ? '<div class="record-banner">⭐ NEW PERSONAL RECORD! ⭐</div>' : ''}
              
              <div class="stats-box">
                <h2>Level Completed!</h2>
                <div class="difficulty-badge">
                  ${difficultyEmojis[difficulty] || '🎯'} ${difficulty.toUpperCase()} DIFFICULTY
                </div>
                <div class="time-display">
                  ⏱️ ${timeFormatted}
                </div>
                <p style="margin: 0; font-size: 16px;">Completion Time</p>
              </div>
              
              <p style="font-size: 18px; margin: 30px 0;">
                ${isNewRecord ? 
                  "You've beaten your previous best time! Amazing work! 🌟" : 
                  "Excellent work on completing this puzzle! Keep going! 💪"}
              </p>
              
              <p>Ready for the next challenge?</p>
              
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">Play Again 🚀</a>
              
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Keep up the great work and continue improving your skills!
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Sudoku Master. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Victory email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending victory email:', error);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendVictoryEmail
};
