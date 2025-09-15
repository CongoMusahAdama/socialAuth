#!/bin/bash

# TapIn Development Startup Script

echo "🚀 Starting TapIn Development Environment"
echo "========================================"

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Please copy env.example to .env and configure your OAuth credentials."
    echo "   cd backend && cp env.example .env"
    exit 1
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Frontend .env file not found. Please copy env.example to .env"
    echo "   cd frontend && cp env.example .env"
    exit 1
fi

echo "✅ Environment files found"
echo ""

# Start backend in background
echo "🔧 Starting backend server..."
cd backend
npm install > /dev/null 2>&1
npm run start:dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend server..."
cd frontend
npm install > /dev/null 2>&1
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 Development servers started!"
echo "   Backend:  http://localhost:4000"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait

# Cleanup
echo ""
echo "🛑 Stopping servers..."
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
echo "✅ Servers stopped"
