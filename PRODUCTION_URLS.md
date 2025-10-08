# 🌐 Production URLs

## Live Application

### Frontend (React App)
**URL:** https://sudoku-app-secf.onrender.com/

### Backend (API Server)
**URL:** https://sudoku-app-servers.onrender.com/
**API Endpoints:** https://sudoku-app-servers.onrender.com/api/

### Health Check
**URL:** https://sudoku-app-servers.onrender.com/health
**Response:** `{"status":"OK","message":"Server is running"}`

---

## Environment Configuration

### Render Backend Service
**Service Name:** sudoku-app-servers
**Environment Variables:**
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sudoku-game?retryWrites=true&w=majority
JWT_SECRET=your_secret_key
EMAIL_SERVICE=gmail
EMAIL_USER=baladharshan1972@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
FRONTEND_URL=https://sudoku-app-secf.onrender.com
```

### Render Frontend Service
**Service Name:** sudoku-app-secf
**Environment Variables:**
```
REACT_APP_API_URL=https://sudoku-app-servers.onrender.com/api
```

---

## API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user
- **GET** `/api/auth/me` - Get current user (auth required)

### Game
- **POST** `/api/game/victory` - Record victory (auth required)
- **POST** `/api/game/progress` - Save game progress (auth required)
- **GET** `/api/game/leaderboard?difficulty=easy` - Get leaderboard

---

## Testing Production

### Test Backend Health
```bash
curl https://sudoku-app-servers.onrender.com/health
```

### Test Registration
```bash
curl -X POST https://sudoku-app-servers.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"test123"}'
```

### Test Login
```bash
curl -X POST https://sudoku-app-servers.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

---

## CORS Configuration

**Allowed Origins:**
- http://localhost:3000 (development)
- https://sudoku-app-secf.onrender.com (production frontend)

**Credentials:** Enabled

---

## MongoDB Atlas

**Database:** sudoku-game
**Collections:**
- users

**Connection String Format:**
```
mongodb+srv://username:password@cluster.xxxxx.mongodb.net/sudoku-game?retryWrites=true&w=majority
```

---

## Deployment Status

✅ **Backend:** Deployed and running
✅ **Frontend:** Deployed and running
✅ **Database:** MongoDB Atlas connected
✅ **CORS:** Configured for production frontend
✅ **Email:** Gmail integration active

---

## Troubleshooting

### If frontend can't connect to backend:
1. Check CORS settings in backend
2. Verify `REACT_APP_API_URL` in frontend environment variables
3. Check browser console for CORS errors

### If MongoDB connection fails:
1. Verify MongoDB Atlas IP whitelist (0.0.0.0/0)
2. Check connection string credentials
3. Ensure database user has read/write permissions

### If emails not sending:
1. Verify Gmail App Password is correct
2. Check `EMAIL_USER` and `EMAIL_PASSWORD` in backend env
3. Review backend logs for email errors

---

**Last Updated:** $(date)
**Status:** ✅ All systems operational
