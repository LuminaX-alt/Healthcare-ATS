#!/bin/bash

echo "=========================================="
echo "🚀 STARTING YOUR HEALTHCARE APPLICATION"
echo "=========================================="
echo ""

# Navigate to project directory
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype

# Kill any existing processes
echo "🧹 Cleaning up old processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
sleep 2

# Check MongoDB
echo ""
echo "🔍 Checking MongoDB..."
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running"
else
    echo "⚠️ MongoDB not running, starting it..."
    brew services start mongodb-community 2>/dev/null
    sleep 3
fi

# Start Backend Server
echo ""
echo "🔧 Starting Backend Server (Port 3001)..."
cd server
node index.js > /tmp/healthcare-backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
cd ..
sleep 4

# Check if backend started
if lsof -ti:3001 > /dev/null 2>&1; then
    echo "✅ Backend is RUNNING on http://localhost:3001"
else
    echo "❌ Backend FAILED to start!"
    echo "Error log:"
    tail -20 /tmp/healthcare-backend.log
    exit 1
fi

# Start Frontend
echo ""
echo "🎨 Starting Frontend App (Port 3000)..."
BROWSER=none npm start > /tmp/healthcare-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# Wait for frontend to start
echo "Waiting for frontend to compile..."
sleep 15

# Check if frontend started
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is RUNNING on http://localhost:3000"
else
    echo "⚠️ Frontend may still be compiling..."
    echo "Check logs: tail -f /tmp/healthcare-frontend.log"
fi

echo ""
echo "=========================================="
echo "✅ APPLICATION STARTED!"
echo "=========================================="
echo ""
echo "🌐 OPEN IN BROWSER:"
echo "   👉 http://localhost:3000"
echo ""
echo "🔐 LOGIN CREDENTIALS:"
echo "   Admin:    admin@hospital.com / admin123"
echo "   Patient:  +1234567890 / OTP: 123456"
echo "   Doctor:   doctor@hospital.com / doctor123"
echo ""
echo "📊 BACKEND API: http://localhost:3001/api"
echo ""
echo "📝 VIEW LOGS:"
echo "   Backend:  tail -f /tmp/healthcare-backend.log"
echo "   Frontend: tail -f /tmp/healthcare-frontend.log"
echo ""
echo "🛑 TO STOP:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Process IDs saved to /tmp/healthcare-pids.txt"
echo "$BACKEND_PID $FRONTEND_PID" > /tmp/healthcare-pids.txt
echo ""
echo "Press Ctrl+C to exit (servers will keep running)"
echo "=========================================="

# Keep script running to show logs
tail -f /tmp/healthcare-backend.log /tmp/healthcare-frontend.log
