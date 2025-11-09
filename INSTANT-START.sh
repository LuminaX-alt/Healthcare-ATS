#!/bin/bash

# ⚡ INSTANT START - Production Build (FASTEST!)

echo "⚡ INSTANT START - Production Mode"
echo "===================================="
echo ""

cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype

echo "🛑 Stopping services..."
pkill -f "node" 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:5000 | xargs kill -9 2>/dev/null
sleep 1
echo "✅ Stopped"
echo ""

# Check if build exists
if [ ! -d "build" ]; then
  echo "📦 No build found. Creating production build..."
  echo "   (This is ONE-TIME and takes 60 seconds)"
  echo ""
  npm run build
  echo ""
  echo "✅ Build created!"
  echo ""
else
  echo "✅ Production build exists"
  echo ""
fi

echo "🚀 Starting backend on port 3001..."
cd server
nohup npm start > ../backend.log 2>&1 &
sleep 3
echo "✅ Backend running"
echo ""

echo "🎨 Starting frontend on port 5000 (production)..."
cd ..

# Check if serve is installed, install if needed
if ! command -v serve &> /dev/null; then
  echo "📦 Installing 'serve' package..."
  npm install -g serve
fi

nohup npx serve -s build -l 5000 > frontend-prod.log 2>&1 &
sleep 2
echo "✅ Frontend running"
echo ""

echo "═══════════════════════════════════════"
echo "✅ READY - SUPER FAST!"
echo "═══════════════════════════════════════"
echo ""
echo "🌐 Production: http://localhost:5000"
echo "🔧 Backend:    http://localhost:3001"
echo ""
echo "⚡ This is MUCH faster than dev mode!"
echo ""
echo "📋 Opening browser in 2 seconds..."
echo ""

sleep 2
open http://localhost:5000

echo "🎉 Done! App should load INSTANTLY!"
echo ""
echo "🔑 Login: doctor@hospital.com / doctorpass123"
echo ""
