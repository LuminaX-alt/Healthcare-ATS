#!/bin/bash

# YOUR COMPLETE REACT APP - RESTART NOW

echo "🔥 STARTING YOUR COMPLETE REACT APP"
echo "===================================="
echo ""

cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype

# Kill everything first
echo "🛑 Stopping old processes..."
pkill -f node 2>/dev/null
pkill -f npm 2>/dev/null
pkill -f react-scripts 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 2
echo "✅ Old processes stopped"
echo ""

# Start MongoDB
echo "🗄️  Starting MongoDB..."
brew services start mongodb-community 2>/dev/null || mongod --fork --config /usr/local/etc/mongod.conf 2>/dev/null || echo "⚠️  Start MongoDB manually if needed"
sleep 3
echo ""

# Start Backend
echo "🚀 Starting Backend Server..."
cd server
node index.js > ../backend.log 2>&1 &
BACKEND_PID=$!
sleep 5

# Verify backend is running
if lsof -i :3001 > /dev/null 2>&1; then
    echo "✅ Backend running on port 3001 (PID: $BACKEND_PID)"
else
    echo "❌ Backend failed! Check backend.log"
    tail -20 ../backend.log
    exit 1
fi
echo ""

# Start React Frontend
echo "🎨 Starting React Frontend..."
cd ..
npm start &
FRONTEND_PID=$!
echo "✅ React starting (PID: $FRONTEND_PID)"
echo ""

echo "════════════════════════════════════════"
echo "✅ YOUR REACT APP IS RUNNING!"
echo "════════════════════════════════════════"
echo ""
echo "🎨 React:    http://localhost:3000"
echo "🚀 Backend:  http://localhost:3001"
echo "🗄️  MongoDB:  localhost:27017"
echo ""
echo "⏳ Wait 15-20 seconds for React to compile..."
echo ""
echo "🔑 LOGIN:"
echo "   doctor@hospital.com / doctorpass123"
echo ""

# Open browser after delay
sleep 15
open http://localhost:3000

echo "🎉 Browser opened! Your app is ready!"
