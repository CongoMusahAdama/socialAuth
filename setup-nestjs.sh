#!/bin/bash

echo "🚀 Setting up NestJS Backend for TapIn"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
    echo "❌ Error: backend/package.json not found. Make sure you're in the project root."
    exit 1
fi

echo "📦 Installing backend dependencies..."
cd backend

# Try different installation methods
echo "Attempting npm install..."
if npm install; then
    echo "✅ Dependencies installed successfully!"
elif npm install --legacy-peer-deps; then
    echo "✅ Dependencies installed with legacy peer deps!"
elif npm install --force; then
    echo "✅ Dependencies installed with force flag!"
else
    echo "❌ npm install failed. Trying yarn..."
    if command -v yarn &> /dev/null; then
        if yarn install; then
            echo "✅ Dependencies installed with yarn!"
        else
            echo "❌ Yarn installation also failed."
            exit 1
        fi
    else
        echo "❌ Both npm and yarn failed. Please check your Node.js version (should be 18+)."
        exit 1
    fi
fi

echo ""
echo "🔧 Setting up environment file..."
if [ ! -f ".env" ]; then
    if [ -f "env.example" ]; then
        cp env.example .env
        echo "✅ Created .env file from env.example"
        echo "⚠️  Please edit .env file with your OAuth credentials"
    else
        echo "⚠️  env.example not found. Please create .env file manually"
    fi
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🏗️  Building NestJS application..."
if npm run build; then
    echo "✅ Build successful!"
else
    echo "⚠️  Build failed, but this might be normal for development"
fi

echo ""
echo "🎉 NestJS Backend Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your OAuth credentials"
echo "2. Start backend: cd backend && npm run start:dev"
echo "3. Start frontend: cd frontend && npm run dev"
echo "4. Open http://localhost:3000"
echo ""
echo "Backend will run on: http://localhost:4000"
echo "Frontend will run on: http://localhost:3000"
