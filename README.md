# TapIn - TikTok & LinkedIn Authentication App

A minimal, secure TypeScript app with NestJS backend and React frontend that supports OAuth2 login via **TikTok** and **LinkedIn**.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- TikTok Developer Account
- LinkedIn Developer Account

### 1. Clone and Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

#### Backend Environment
```bash
cd backend
cp env.example .env
```

Edit `backend/.env` with your OAuth credentials:

```env
# Backend Configuration
NODE_ENV=development
PORT=4000
BACKEND_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# LinkedIn OAuth Configuration
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_REDIRECT_URI=http://localhost:4000/auth/linkedin/callback

# TikTok OAuth Configuration
TIKTOK_CLIENT_ID=your-tiktok-client-id
TIKTOK_CLIENT_SECRET=your-tiktok-client-secret
TIKTOK_REDIRECT_URI=http://localhost:4000/auth/tiktok/callback
```

#### Frontend Environment
```bash
cd frontend
cp env.example .env
```

Edit `frontend/.env`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

### 3. OAuth App Registration

#### LinkedIn Setup
1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Create a new app
3. Add redirect URI: `http://localhost:4000/auth/linkedin/callback`
4. Request permissions: `r_liteprofile`, `r_emailaddress`
5. Copy Client ID and Client Secret to your `.env` file

#### TikTok Setup
1. Go to [TikTok Developer Portal](https://developers.tiktok.com/)
2. Create a new app
3. Add redirect URI: `http://localhost:4000/auth/tiktok/callback`
4. Request permissions: `user.info.basic`
5. Copy Client ID and Client Secret to your `.env` file

### 4. Run the Application

#### Start Backend (Terminal 1)
```bash
cd backend
npm run start:dev
```
Backend will run on `http://localhost:4000`

#### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

### 5. Test the Flow
1. Open `http://localhost:3000`
2. Click **Continue with LinkedIn** or **Continue with TikTok**
3. Complete OAuth consent
4. You'll be redirected back to the profile page
5. Click **Sign out** to logout

## 🏗️ Architecture

### Backend (NestJS)
- **OAuth2 Flow**: Server-side authorization code flow
- **JWT Authentication**: Short-lived tokens (1h) in httpOnly cookies
- **CSRF Protection**: State parameter validation
- **In-Memory Store**: Demo user storage (no database required)

### Frontend (Next.js + React)
- **Modern UI**: Tailwind CSS with glass morphism effects
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels, keyboard navigation
- **Type Safety**: Full TypeScript implementation

## 🔒 Security Features

- ✅ Authorization Code flow (server-side)
- ✅ CSRF protection with state parameter
- ✅ httpOnly cookies for JWT storage
- ✅ Secure cookie flags in production
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ No client secrets in frontend

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── auth/           # OAuth strategies & controllers
│   │   ├── users/          # User service & interfaces
│   │   ├── common/         # JWT strategy & guards
│   │   └── main.ts         # Application entry point
│   ├── package.json
│   └── env.example
├── frontend/
│   ├── pages/              # Next.js pages
│   ├── components/         # React components
│   ├── lib/                # API utilities
│   ├── styles/             # Global styles
│   ├── package.json
│   └── env.example
└── README.md
```

## 🎨 UI Features

- **Glass Morphism**: Frosted glass effect with backdrop blur
- **Gradient Backgrounds**: Beautiful color transitions
- **Social Branding**: Authentic TikTok and LinkedIn button styles
- **Animations**: Subtle hover effects and confetti on login
- **Responsive**: Works perfectly on mobile and desktop

## 🔧 API Endpoints

### Authentication
- `GET /auth/linkedin` - Start LinkedIn OAuth flow
- `GET /auth/linkedin/callback` - LinkedIn OAuth callback
- `GET /auth/tiktok` - Start TikTok OAuth flow  
- `GET /auth/tiktok/callback` - TikTok OAuth callback
- `POST /auth/logout` - Logout and clear session

### User
- `GET /me` - Get current user profile (protected)

## 🚨 Production Notes

1. **Environment Variables**: Use strong, unique secrets
2. **HTTPS**: Enable secure cookies in production
3. **CORS**: Update allowed origins for production domains
4. **Database**: Replace in-memory store with persistent storage
5. **Monitoring**: Add logging and error tracking

## 🐛 Troubleshooting

### Common Issues

**OAuth Redirect Mismatch**
- Ensure redirect URIs in OAuth apps match exactly
- Check for trailing slashes and protocol (http vs https)

**CORS Errors**
- Verify `FRONTEND_URL` in backend `.env`
- Check that frontend is running on the correct port

**JWT Errors**
- Ensure `JWT_SECRET` is set in backend `.env`
- Check cookie settings and domain configuration

## 📝 License

MIT License - feel free to use this project as a starting point for your own applications.

---

**Built with ❤️ using NestJS, Next.js, and Tailwind CSS**
# socialAuth
