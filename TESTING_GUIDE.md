# Testing Guide - Sudoku Master

## Pre-Testing Checklist

Before you start testing, ensure:

1. ✅ MongoDB is installed and running
2. ✅ Node.js is installed (v14+)
3. ✅ Dependencies are installed (frontend & backend)
4. ✅ Environment variables are configured in `server/.env`
5. ✅ Both servers are running (frontend & backend)

## Step-by-Step Testing

### 1. Test MongoDB Connection

**Backend Terminal:**
```bash
cd server
npm run dev
```

**Expected Output:**
```
Server running on port 5000
MongoDB connected
```

✅ **Pass:** You see "MongoDB connected"  
❌ **Fail:** Connection error - Check MongoDB is running and MONGODB_URI is correct

---

### 2. Test User Registration

1. Open browser to `http://localhost:3000`
2. Click "Sign up" link
3. Fill in the form:
   - Username: `testuser1`
   - Email: `your-actual-email@gmail.com` (use real email to test notifications)
   - Password: `password123`
4. Click "Sign Up"

**Expected:**
- ✅ Success message appears
- ✅ Form switches to login mode
- ✅ Check server console: "Welcome email sent"
- ✅ Check your email inbox for welcome email (may take 1-2 minutes)

**MongoDB Verification:**
```javascript
// In MongoDB Compass or mongo shell:
use sudoku-game
db.users.find({ username: "testuser1" })
```

You should see the user with hashed password and email.

---

### 3. Test User Login

1. In login form, enter:
   - Username: `testuser1`
   - Password: `password123`
2. Click "Sign In"

**Expected:**
- ✅ Dashboard loads
- ✅ Welcome message shows: "Welcome, testuser1!"
- ✅ Statistics show all zeros initially
- ✅ Difficulty selector is visible
- ✅ Sudoku type selector is visible

---

### 4. Test Game Play - Easy Level

1. Select **Easy** difficulty
2. Click on a **Classic Sudoku** card
3. Game board appears with timer starting

**Test Interactions:**
- ✅ Click on an empty cell - it highlights
- ✅ Press numbers 1-9 on keyboard - number appears
- ✅ Timer is counting up
- ✅ Cell colors work (given cells are different from empty)
- ✅ Hover effects work on cells

**Quick Win Test:**
- For testing, you can manually fill in all empty cells
- Or use browser console to check board state

---

### 5. Test Game Victory

**To trigger victory quickly:**

1. Play normally or use this test method:
   - Fill in most of the puzzle correctly
   - Complete the final cells

**Expected on Victory:**
- ✅ Victory modal appears with celebration
- ✅ Shows completion time
- ✅ Shows difficulty level
- ✅ "Play Again" button visible
- ✅ Server console shows: "Victory email sent"
- ✅ Check email for victory notification

**Check Dashboard After Victory:**
- ✅ Easy victories count increased by 1
- ✅ Best time shows your completion time
- ✅ Stats are saved

---

### 6. Test Different Difficulty Levels

**Medium Difficulty:**
1. Select "Medium" from difficulty dropdown
2. Start new game
3. Complete puzzle
4. Verify separate tracking from Easy level

**Hard Difficulty:**
1. Select "Hard" from difficulty dropdown
2. Start new game
3. Verify harder puzzle (fewer given numbers)

**Expected:**
- ✅ Each difficulty tracked separately
- ✅ Victory counts separate
- ✅ Best times separate
- ✅ Different number of given cells

---

### 7. Test Email Notifications

**Welcome Email Test:**
1. Register new user with your email
2. Check inbox (and spam folder)
3. Email should arrive within 1-2 minutes

**Victory Email Test:**
1. Complete a game
2. Check inbox for victory email
3. Verify email shows:
   - ✅ Your username
   - ✅ Difficulty level
   - ✅ Completion time
   - ✅ Beautiful HTML formatting

**New Record Email Test:**
1. Complete same difficulty level faster
2. Email should say "NEW PERSONAL RECORD!"

---

### 8. Test Leaderboard

**Currently in Development** - Leaderboard API exists but may not display yet

API Test:
```bash
# In another terminal:
curl http://localhost:5000/api/game/leaderboard?difficulty=easy
```

Expected: JSON array of top players

---

### 9. Test Session Persistence

1. Complete a game and close browser
2. Reopen browser to `http://localhost:3000`

**Expected:**
- ✅ Still logged in
- ✅ Statistics preserved
- ✅ Can start new game immediately

---

### 10. Test Logout

1. Click "Logout" button in header
2. Verify return to login screen
3. Try accessing dashboard - should redirect to login

---

### 11. Test Responsive Design

**Desktop (1920px):**
- ✅ All elements properly spaced
- ✅ Stats in 2-column grid
- ✅ Game board centered

**Tablet (768px):**
- ✅ Layout adjusts
- ✅ Stats stack vertically
- ✅ Game board scales

**Mobile (375px):**
- ✅ Single column layout
- ✅ Smaller cells
- ✅ Buttons stack
- ✅ Touch-friendly sizes

Test by resizing browser window or using DevTools device emulation.

---

### 12. Test Error Handling

**Duplicate Username:**
1. Try to register with existing username
2. Expected: Error message "Username already exists"

**Duplicate Email:**
1. Try to register with existing email
2. Expected: Error message "Email already exists"

**Wrong Password:**
1. Try to login with wrong password
2. Expected: Error message "Invalid credentials"

**Invalid Email Format:**
1. Try to register with "notanemail"
2. Expected: Error message "Please enter a valid email"

**Short Password:**
1. Try to register with "12345" (less than 6 chars)
2. Expected: Error message about password length

---

## Common Issues & Solutions

### Issue: MongoDB Connection Failed

**Solution:**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Issue: Email Not Sending

**Check:**
1. EMAIL_USER and EMAIL_PASSWORD in .env are correct
2. Using App Password (not regular Gmail password)
3. 2-Step Verification enabled on Gmail
4. Check server console for specific error

**Test Email Service:**
```javascript
// Add to server.js temporarily
const { sendWelcomeEmail } = require('./utils/emailService');
sendWelcomeEmail('your-email@gmail.com', 'Test User')
  .then(() => console.log('Test email sent!'))
  .catch(err => console.error('Email error:', err));
```

### Issue: Port Already in Use

**Solution:**
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue: Frontend Can't Connect to Backend

**Check:**
1. Backend is running on port 5000
2. `src/services/api.js` has correct API_BASE_URL
3. CORS is enabled in `server/server.js`

---

## Performance Testing

### Load Test - Multiple Users

1. Register 5-10 test users
2. Play games with each
3. Check MongoDB for all records
4. Verify leaderboard updates

### Concurrent Games

1. Open 2-3 browser windows
2. Login different users
3. Play simultaneously
4. Verify no conflicts

---

## Security Testing

### Test JWT Expiration

JWT tokens expire in 30 days. To test:
1. Login and save token from localStorage
2. Manually modify token
3. Try to access protected route
4. Expected: Redirected to login

### Test Password Hashing

Check MongoDB:
```javascript
db.users.findOne({ username: "testuser1" })
```

Password should be a bcrypt hash starting with `$2a$` or `$2b$`, not plain text.

---

## Final Checklist

After all tests:

- [ ] User can register with email
- [ ] Welcome email received
- [ ] User can login
- [ ] Game plays smoothly
- [ ] Timer works correctly
- [ ] Victory detected correctly
- [ ] Victory email received
- [ ] Stats update properly
- [ ] New records detected
- [ ] All difficulty levels work
- [ ] Logout works
- [ ] Session persists on refresh
- [ ] Mobile responsive
- [ ] Error messages work
- [ ] UI animations smooth
- [ ] No console errors

---

## Test Data Cleanup

After testing, clean up test data:

```javascript
// MongoDB shell or Compass
use sudoku-game

// Delete test users
db.users.deleteMany({ username: /^testuser/ })

// Or delete specific user
db.users.deleteOne({ username: "testuser1" })

// View all users
db.users.find().pretty()
```

---

## Reporting Issues

If you find bugs during testing:

1. Note the exact steps to reproduce
2. Check browser console for errors
3. Check server console for errors
4. Check MongoDB state
5. Document expected vs actual behavior

---

## Success Criteria

Your app is working perfectly if:

✅ All authentication flows work  
✅ Games can be played and completed  
✅ Emails are sent successfully  
✅ Stats persist correctly  
✅ UI is responsive and attractive  
✅ No console errors  
✅ All difficulty levels function  
✅ MongoDB stores all data correctly  

## 🎉 Happy Testing!
