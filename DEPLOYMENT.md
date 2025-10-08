# 🚀 Sudoku Master - Render Deployment Guide

## Prerequisites
- GitHub account
- Render account (free tier available at https://render.com)
- MongoDB Atlas account (free tier at https://www.mongodb.com/cloud/atlas)
- Gmail account with App Password enabled

---

## 📋 Step-by-Step Deployment

### 1. **Prepare MongoDB Atlas Database**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click **"Connect"** → **"Connect your application"**
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/sudoku-game`)
5. **Important:** 
   - Replace `<password>` with your actual database password
   - Add `/sudoku-game` at the end before the `?` parameters
   - Whitelist all IPs (0.0.0.0/0) in Network Access for Render

---

### 2. **Setup Gmail App Password**

1. Go to Google Account → Security
2. Enable **2-Step Verification**
3. Go to **App Passwords** (https://myaccount.google.com/apppasswords)
4. Create new app password for "Mail"
5. Copy the 16-character password (you'll use this as `EMAIL_PASSWORD`)

---

### 3. **Push Code to GitHub**

```bash
cd "C:\College Projects\UID - Micro Project\sudoku-uid"

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - Sudoku Master app ready for deployment"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/sudoku-master.git
git branch -M main
git push -u origin main
```

---

### 4. **Deploy Backend to Render**

#### A. Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name:** `sudoku-backend`
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

#### B. Set Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

| Key | Value | Example |
|-----|-------|---------|
| `NODE_ENV` | `production` | `production` |
| `PORT` | `10000` | Auto-assigned by Render |
| `MONGODB_URI` | Your MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/sudoku-game` |
| `JWT_SECRET` | Strong random string | `your_super_secret_jwt_key_12345` |
| `EMAIL_SERVICE` | `gmail` | `gmail` |
| `EMAIL_USER` | Your Gmail address | `youremail@gmail.com` |
| `EMAIL_PASSWORD` | Gmail App Password (16 chars) | `abcd efgh ijkl mnop` |
| `FRONTEND_URL` | Leave empty for now | Will update after frontend deployment |

#### C. Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment (3-5 minutes)
3. Copy your backend URL (e.g., `https://sudoku-backend.onrender.com`)

---

### 5. **Deploy Frontend to Render**

#### A. Create New Static Site

1. Go to Render Dashboard
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. Configure the site:
   - **Name:** `sudoku-frontend`
   - **Root Directory:** Leave empty (or `.`)
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

#### B. Set Environment Variable

Click **"Advanced"** → **"Add Environment Variable"**:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://your-backend-url.onrender.com/api` |

**Example:** `https://sudoku-backend.onrender.com/api`

#### C. Deploy Frontend

1. Click **"Create Static Site"**
2. Wait for deployment (5-7 minutes)
3. Your app will be live at `https://sudoku-frontend.onrender.com`

---

### 6. **Update Backend CORS**

1. Go to your **Backend service** on Render
2. Go to **"Environment"** tab
3. Update `FRONTEND_URL` variable:
   - **Value:** `https://your-frontend-url.onrender.com`
   - Example: `https://sudoku-frontend.onrender.com`
4. Click **"Save Changes"**
5. Service will auto-redeploy

---

### 7. **Test Your Deployment**

1. Visit your frontend URL
2. Try registering a new account
3. Check your email for welcome message
4. Play a game and complete it
5. Check email for victory notification
6. Verify leaderboard updates

---

## 🔧 Troubleshooting

### Backend Won't Start
- Check Render logs: Dashboard → Your Service → Logs
- Verify all environment variables are set correctly
- Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`

### Frontend Can't Connect to Backend
- Verify `REACT_APP_API_URL` includes `/api` at the end
- Check CORS error in browser console
- Ensure `FRONTEND_URL` is set in backend environment variables

### Emails Not Sending
- Verify Gmail App Password is correct (16 characters, no spaces)
- Check `EMAIL_USER` matches your Gmail address
- Review backend logs for email errors

### Free Tier Limitations
- Backend may sleep after 15 mins of inactivity (cold starts)
- MongoDB Atlas free tier: 512 MB storage
- Render free tier: 750 hours/month

---

## 🎉 You're Live!

Your Sudoku Master app is now deployed! Share your frontend URL with friends and enjoy!

**Example URLs:**
- **Frontend:** `https://sudoku-frontend.onrender.com`
- **Backend API:** `https://sudoku-backend.onrender.com/api`
- **Health Check:** `https://sudoku-backend.onrender.com/health`

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)

---

## 🔄 Continuous Deployment

Every time you push to your `main` branch on GitHub:
- Render will automatically rebuild and redeploy both services
- No manual deployment needed!

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main
# Automatic deployment will start!
```
