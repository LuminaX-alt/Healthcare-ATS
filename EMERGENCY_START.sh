#!/bin/bash

# EMERGENCY STARTUP SCRIPT FOR YOUR APPLICATION
# This will get your app running NO MATTER WHAT

echo "🚨 EMERGENCY STARTUP - GETTING YOUR APP BACK 🚨"
echo "================================================"
echo ""

# Kill any existing processes on ports
echo "🧹 Cleaning up ports..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
sleep 2

# Check MongoDB
echo ""
echo "🔍 Checking MongoDB..."
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is RUNNING"
else
    echo "❌ MongoDB is NOT running"
    echo "Starting MongoDB now..."
    brew services start mongodb-community 2>/dev/null || mongod --fork --logpath /tmp/mongodb.log --dbpath /usr/local/var/mongodb 2>/dev/null
    sleep 3
fi

# Navigate to project
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype

echo ""
echo "🚀 Starting BACKEND SERVER (Port 3001)..."
cd server
node index.js > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
sleep 3

# Check if backend started
if lsof -ti:3001 > /dev/null 2>&1; then
    echo "✅ BACKEND IS RUNNING on http://localhost:3001"
else
    echo "❌ BACKEND FAILED TO START"
    echo "Error log:"
    cat /tmp/backend.log
    exit 1
fi

echo ""
echo "🎨 Starting FRONTEND APP (Port 3000)..."
cd ..
npm start > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
sleep 5

# Check if frontend started
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "✅ FRONTEND IS RUNNING on http://localhost:3000"
else
    echo "❌ FRONTEND FAILED TO START"
    echo "Error log:"
    cat /tmp/frontend.log
    exit 1
fi

echo ""
echo "================================================"
echo "🎉 YOUR APPLICATION IS NOW RUNNING! 🎉"
echo "================================================"
echo ""
echo "🌐 OPEN THIS URL IN YOUR BROWSER:"
echo "   👉 http://localhost:3000 👈"
echo ""
echo "🔐 LOGIN CREDENTIALS:"
echo "   Admin:   admin@hospital.com / admin123"
echo "   Patient: +1234567890 / OTP: 123456"
echo "   Doctor:  doctor@hospital.com / doctor123"
echo ""
echo "Backend PID: $BACKEND_PID (Port 3001)"
echo "Frontend PID: $FRONTEND_PID (Port 3000)"
echo ""
echo "📝 To view logs:"
echo "   Backend:  tail -f /tmp/backend.log"
echo "   Frontend: tail -f /tmp/frontend.log"
echo ""
echo "🛑 To STOP the app:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   OR run: lsof -ti:3000,3001 | xargs kill -9"
echo ""
echo "Press Ctrl+C to stop monitoring (servers will keep running)"
echo "================================================"

# Keep script alive
tail -f /tmp/backend.log /tmp/frontend.log
