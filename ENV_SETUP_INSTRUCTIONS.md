# 🔧 Environment Variables Setup

## Update Your .env File for MongoDB Atlas

**Current Location:** `server/.env`

⚠️ **IMPORTANT:** You need to manually update your `.env` file with the MongoDB Atlas connection string.

---

## What to Change

### ❌ OLD (Local MongoDB Compass):
```env
MONGODB_URI=mongodb://localhost:27017/sudoku-game
```

### ✅ NEW (MongoDB Atlas Cloud):
```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.xxxxx.mongodb.net/sudoku-game?retryWrites=true&w=majority
```

---

## How to Get Your Connection String

1. **Go to MongoDB Atlas Dashboard**
   - Visit: https://cloud.mongodb.com
   - Login to your account

2. **Click "Connect" on your cluster**
   - Find your cluster in the Database section
   - Click the "Connect" button

3. **Choose "Connect your application"**
   - Driver: Node.js
   - Version: 4.1 or later

4. **Copy the connection string**
   - It will look like: `mongodb+srv://username:<password>@cluster.xxxxx.mongodb.net/`

5. **Modify the connection string:**
   - Replace `<password>` with your actual database user password
   - Add `/sudoku-game` before the `?` to specify the database name
   - Keep the query parameters (`?retryWrites=true&w=majority`)

---

## Complete .env File Example

Open `server/.env` and update it to look like this:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://sudokuadmin:MyPassword123@sudoku-cluster.abcde.mongodb.net/sudoku-game?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Gmail Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=baladharshan1972@gmail.com
EMAIL_PASSWORD=your_gmail_app_password_here

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

## ✅ Verify It Works

1. **Save the `.env` file**

2. **Restart your backend server:**
   ```bash
   cd server
   npm run dev
   ```

3. **Look for success message:**
   ```
   Server running on port 5000
   MongoDB connected ✅
   ```

4. **If you see errors:**
   - Double-check username and password
   - Ensure no `<` `>` brackets in the connection string
   - Verify IP whitelist in Atlas (0.0.0.0/0)
   - Make sure database name is `/sudoku-game`

---

## 🔍 Common Mistakes

### ❌ Wrong:
```env
# Missing database name
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true

# Password still has brackets
MONGODB_URI=mongodb+srv://user:<password>@cluster.mongodb.net/sudoku-game

# Missing query parameters
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sudoku-game

# Space in password (URL encode special characters)
MONGODB_URI=mongodb+srv://user:my password@cluster.mongodb.net/sudoku-game
```

### ✅ Correct:
```env
MONGODB_URI=mongodb+srv://username:actualpassword@cluster.xxxxx.mongodb.net/sudoku-game?retryWrites=true&w=majority
```

---

## 🔐 Special Characters in Password

If your password contains special characters (@, #, $, %, etc.), you need to URL encode them:

| Character | URL Encoded |
|-----------|-------------|
| @ | %40 |
| # | %23 |
| $ | %24 |
| % | %25 |
| & | %26 |
| / | %2F |
| : | %3A |

**Example:**
- Password: `MyPass@123`
- Encoded: `MyPass%40123`
- Connection: `mongodb+srv://user:MyPass%40123@cluster...`

---

## 📚 Next Steps

1. ✅ Update `.env` with MongoDB Atlas connection string
2. ✅ Restart server and verify "MongoDB connected" message
3. ✅ Test registration and login
4. ✅ Check Atlas dashboard to see your database and collections

**Need help?** See [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md) for full setup guide.
