# Backend - TapIn Authentication API

NestJS backend providing OAuth2 authentication for TikTok and LinkedIn.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp env.example .env
# Edit .env with your OAuth credentials

# Start development server
npm run start:dev
```

## 🔧 Environment Variables

See `env.example` for all required environment variables:

- **OAuth Credentials**: LinkedIn and TikTok client IDs/secrets
- **JWT Secret**: For signing authentication tokens
- **URLs**: Backend and frontend URLs for CORS and redirects

## 📡 API Endpoints

### Authentication Routes
- `GET /auth/linkedin` - Initiate LinkedIn OAuth
- `GET /auth/linkedin/callback` - LinkedIn OAuth callback
- `GET /auth/tiktok` - Initiate TikTok OAuth  
- `GET /auth/tiktok/callback` - TikTok OAuth callback
- `POST /auth/logout` - Logout user

### User Routes
- `GET /me` - Get current user profile (requires authentication)

## 🔒 Security Features

- OAuth2 Authorization Code flow
- JWT tokens in httpOnly cookies
- CSRF protection with state parameter
- CORS configuration
- Input validation

## 🏗️ Architecture

- **Auth Module**: OAuth strategies and controllers
- **Users Module**: User management service
- **Common Module**: JWT strategy and guards
- **In-Memory Store**: Demo user storage (no database)

## 📦 Dependencies

- `@nestjs/core` - NestJS framework
- `@nestjs/passport` - Authentication strategies
- `passport-linkedin-oauth2` - LinkedIn OAuth
- `passport-oauth2` - Generic OAuth2 for TikTok
- `@nestjs/jwt` - JWT token handling
- `cookie-parser` - Cookie parsing middleware
