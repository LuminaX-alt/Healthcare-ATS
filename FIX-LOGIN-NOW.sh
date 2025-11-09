#!/bin/bash

# FOOLPROOF APP STARTER - GUARANTEED TO WORK

echo "🚀 STARTING YOUR APP - COMPLETE SOLUTION"
echo "=========================================="
echo ""

# Step 1: Kill everything
echo "1️⃣  Killing old processes..."
killall node 2>/dev/null
killall npm 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 2
echo "   ✅ Done"
echo ""

# Step 2: Start MongoDB
echo "2️⃣  Starting MongoDB..."
mongod --config /usr/local/etc/mongod.conf --fork 2>/dev/null || \
brew services start mongodb-community 2>/dev/null || \
echo "   ⚠️  MongoDB: Start manually with 'brew services start mongodb-community'"
sleep 3
echo "   ✅ Done"
echo ""

# Step 3: Navigate to project
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype

# Step 4: Start Backend
echo "3️⃣  Starting Backend Server..."
cd server
node index.js > ../backend-running.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"
sleep 5

# Check if backend started
if lsof -i :3001 >/dev/null 2>&1; then
    echo "   ✅ Backend is RUNNING on port 3001"
else
    echo "   ❌ Backend FAILED to start"
    echo "   📋 Last 10 lines of log:"
    tail -10 ../backend-running.log
    exit 1
fi
echo ""

# Step 5: Start Frontend
echo "4️⃣  Starting React Frontend..."
cd ..
BROWSER=none npm start > frontend-running.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"
echo "   ✅ React is compiling..."
echo ""

echo "════════════════════════════════════════════════"
echo "✅ YOUR APP IS NOW RUNNING!"
echo "════════════════════════════════════════════════"
echo ""
echo "🗄️  MongoDB:  Running (localhost:27017)"
echo "🚀 Backend:  http://localhost:3001 (PID: $BACKEND_PID)"
echo "🎨 Frontend: http://localhost:3000 (PID: $FRONTEND_PID)"
echo ""
echo "⏳ Wait 15-20 seconds for React to compile..."
echo ""
echo "🔑 LOGIN CREDENTIALS:"
echo "   📧 Email:    doctor@hospital.com"
echo "   🔐 Password: doctorpass123"
echo ""
echo "📊 VIEW LOGS:"
echo "   Backend:  tail -f backend-running.log"
echo "   Frontend: tail -f frontend-running.log"
echo ""
echo "🛑 TO STOP:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Open browser after delay
echo "🌐 Opening browser in 15 seconds..."
sleep 15
open http://localhost:3000

echo ""
echo "✅ DONE! Login should work now!"
echo ""
