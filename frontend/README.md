# Frontend - TapIn Authentication UI

React + Next.js frontend with beautiful UI for TikTok and LinkedIn authentication.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp env.example .env
# Edit .env with backend URL

# Start development server
npm run dev
```

## 🎨 Features

- **Modern UI**: Glass morphism design with Tailwind CSS
- **Responsive**: Mobile-first responsive design
- **Accessible**: ARIA labels and keyboard navigation
- **Type Safe**: Full TypeScript implementation
- **Animations**: Subtle hover effects and confetti

## 📱 Pages

- **`/`** - Login page with social buttons
- **`/profile`** - User profile with logout option

## 🧩 Components

- **`SocialButton`** - Branded OAuth buttons
- **`ProfileCard`** - User profile display
- **`Logo`** - Animated app logo

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Classes**: Glass morphism and social button styles
- **Gradients**: Beautiful background gradients
- **Animations**: CSS animations and transitions

## 🔧 Environment Variables

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

## 📦 Dependencies

- `next` - React framework
- `react` - UI library
- `tailwindcss` - CSS framework
- `axios` - HTTP client
- `lucide-react` - Icon library

## 🎯 User Experience

1. **Landing Page**: Clean login interface with social buttons
2. **OAuth Flow**: Seamless redirect to providers
3. **Profile Page**: User information with logout option
4. **Confetti**: Celebration animation on successful login
