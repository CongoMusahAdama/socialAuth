# 🔗 Backend-Frontend Connection Test Guide

## 🚀 Quick Test Steps

### Step 1: Start Backend Server
```bash
cd backend
npm install
npm run start:dev
```
**Expected output:**
```
🚀 Backend server running on http://localhost:4000
📱 Frontend URL: http://localhost:3000
```

### Step 2: Test Backend Health (Optional)
```bash
# In a new terminal
node test-connection.js
```

### Step 3: Start Frontend Server
```bash
cd frontend
npm install
npm run dev
```
**Expected output:**
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Step 4: Test Connection in Browser
1. Open `http://localhost:3000`
2. Open browser Developer Tools (F12)
3. Check the Console tab
4. You should see: `✅ Backend connected: {status: "OK", message: "Backend is running", timestamp: "..."}`

## 🔍 Manual Connection Tests

### Test 1: Backend Health Check
```bash
curl http://localhost:4000/health
```
**Expected response:**
```json
{
  "status": "OK",
  "message": "Backend is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Test 2: OAuth Endpoints
```bash
# LinkedIn OAuth (should redirect)
curl -I http://localhost:4000/auth/linkedin

# TikTok OAuth (should redirect)
curl -I http://localhost:4000/auth/tiktok
```
**Expected response:** `HTTP/1.1 302 Found` (redirect)

### Test 3: CORS Configuration
```bash
curl -H "Origin: http://localhost:3000" http://localhost:4000/health
```
**Expected response:** Should include CORS headers

## 🐛 Troubleshooting

### Backend Won't Start
- **Check port 4000**: `netstat -an | findstr :4000`
- **Check .env file**: Make sure it exists and has correct values
- **Check dependencies**: `npm install` in backend folder

### Frontend Can't Connect
- **Check backend URL**: Verify `NEXT_PUBLIC_BACKEND_URL=http://localhost:4000` in frontend/.env
- **Check CORS**: Backend should allow `http://localhost:3000`
- **Check browser console**: Look for CORS or network errors

### OAuth Redirects Not Working
- **Check redirect URIs**: Must match exactly in OAuth app settings
- **Check environment variables**: Client ID and Secret must be correct
- **Check OAuth app status**: Make sure apps are active

## ✅ Success Indicators

### Backend Running Correctly
- ✅ Server starts without errors
- ✅ Health endpoint returns 200 OK
- ✅ OAuth endpoints return 302 redirects
- ✅ CORS headers are present

### Frontend Connected
- ✅ No CORS errors in browser console
- ✅ Health check succeeds
- ✅ OAuth buttons redirect to providers
- ✅ Profile page loads after login

### OAuth Flow Working
- ✅ Clicking LinkedIn/TikTok buttons redirects to provider
- ✅ After authorization, redirects back to app
- ✅ Profile page shows user information
- ✅ Logout clears session

## 🔧 Environment Checklist

### Backend (.env)
```env
NODE_ENV=development
PORT=4000
BACKEND_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
LINKEDIN_CLIENT_ID=linkedin-secret
LINKEDIN_CLIENT_SECRET=linkedin-client-secret
LINKEDIN_REDIRECT_URI=http://localhost:4000/auth/linkedin/callback
TIKTOK_CLIENT_ID=your-tiktok-client-id
TIKTOK_CLIENT_SECRET=your-tiktok-client-secret
TIKTOK_REDIRECT_URI=http://localhost:4000/auth/tiktok/callback
```

### Frontend (.env)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

## 🎯 Final Test Flow

1. **Start both servers**
2. **Open http://localhost:3000**
3. **Check console for "✅ Backend connected"**
4. **Click "Continue with LinkedIn"**
5. **Complete OAuth flow**
6. **Verify profile page loads**
7. **Test logout functionality**

If all steps work, your backend-frontend connection is perfect! 🎉
