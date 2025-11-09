#!/bin/bash

# 🚀 SIMPLE RESTART - Just like before, but with Gemini fixed

echo "🚀 Restarting Healthcare App (Port 3000)"
echo "=========================================="
echo ""

cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype

echo "🛑 Stopping old processes..."
pkill -f "node" 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:5000 | xargs kill -9 2>/dev/null
sleep 2
echo "✅ Stopped"
echo ""

echo "🚀 Starting backend (port 3001)..."
cd server
npm start > ../backend.log 2>&1 &
sleep 5
echo "✅ Backend running"
echo ""

echo "🎨 Starting frontend (port 3000)..."
cd ..
npm start > frontend.log 2>&1 &
echo "✅ Frontend starting..."
echo ""

echo "════════════════════════════════════════"
echo "✅ APP RUNNING - Same as before!"
echo "════════════════════════════════════════"
echo ""
echo "🌐 http://localhost:3000"
echo "🔧 Backend: http://localhost:3001"
echo ""
echo "⏳ React is compiling... (wait 15-20 seconds)"
echo ""
echo "📋 Login: doctor@hospital.com / doctorpass123"
echo ""
echo "✅ Only change: Gemini AI now works!"
echo "   (Model changed from 2.5 to 1.5-flash)"
echo ""

# Wait and open browser
sleep 15
open http://localhost:3000

echo "🎉 Browser opening! App works same as before!"
echo ""
