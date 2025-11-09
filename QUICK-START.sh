#!/bin/bash

# 🚀 QUICK START - Healthcare Prototype with Gemini AI

echo "🚀 Starting Healthcare Prototype..."
echo ""

cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype

# Clean up old processes
pkill -f "node.*index.js" 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Start backend
echo "📦 Starting backend server..."
cd server
nohup npm start > ../backend.log 2>&1 &
sleep 5

# Start frontend
echo "🎨 Starting frontend..."
cd ..
nohup npm start > frontend.log 2>&1 &

echo ""
echo "✅ Services started!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:3001"
echo ""
echo "🤖 GEMINI AI IS AT:"
echo "   📁 /server/routes/lumina-ai-gemini.js"
echo ""
echo "⏳ Waiting 10 seconds then opening browser..."
sleep 10
open http://localhost:3000/login/reports
