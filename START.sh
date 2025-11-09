#!/bin/zsh

# Healthcare Application Startup Script
# This script starts both backend and frontend servers

echo "\n🏥 HEALTHCARE APPLICATION STARTUP\n"
echo "=================================="

# Change to project directory
cd "$(dirname "$0")"
PROJECT_DIR="$(pwd)"

# Kill any existing processes on ports 3000 and 3001
echo "\n🧹 Cleaning up ports..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
sleep 2

# Check MongoDB
echo "\n🔍 Checking MongoDB status..."
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running"
else
    echo "⚠️  MongoDB not running. Starting..."
    brew services start mongodb-community 2>/dev/null || {
        echo "❌ Could not start MongoDB with brew services"
        echo "Try manually: mongod --config /usr/local/etc/mongod.conf"
    }
    sleep 3
fi

# Start Backend Server
echo "\n🚀 Starting Backend Server..."
cd "$PROJECT_DIR/server"
node index.js > "$PROJECT_DIR/logs/backend.log" 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait for backend to start
sleep 5

# Check if backend is running
if lsof -ti:3001 > /dev/null 2>&1; then
    echo "   ✅ Backend is running on http://localhost:3001"
else
    echo "   ❌ Backend failed to start!"
    echo "   Check logs: tail -f $PROJECT_DIR/logs/backend.log"
    exit 1
fi

# Start Frontend
echo "\n🎨 Starting Frontend App..."
cd "$PROJECT_DIR"
BROWSER=none npm start > "$PROJECT_DIR/logs/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

# Wait for frontend to compile
echo "   ⏳ Waiting for React to compile (this takes ~20 seconds)..."
sleep 20

# Check if frontend is running
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "   ✅ Frontend is running on http://localhost:3000"
else
    echo "   ⚠️  Frontend may still be starting..."
fi

# Save PIDs
echo "$BACKEND_PID $FRONTEND_PID" > "$PROJECT_DIR/logs/pids.txt"

# Summary
echo "\n=================================="
echo "✅ APPLICATION STARTED!"
echo "=================================="
echo "\n📱 OPEN YOUR BROWSER:"
echo "   👉 http://localhost:3000\n"
echo "🔐 LOGIN CREDENTIALS:"
echo "   Admin:   admin@hospital.com / admin123"
echo "   Patient: +1234567890 / OTP: 123456"
echo "   Doctor:  doctor@hospital.com / doctor123\n"
echo "📊 Backend API: http://localhost:3001/api\n"
echo "📝 View Logs:"
echo "   Backend:  tail -f $PROJECT_DIR/logs/backend.log"
echo "   Frontend: tail -f $PROJECT_DIR/logs/frontend.log\n"
echo "🛑 To Stop:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   OR: lsof -ti:3000,3001 | xargs kill -9\n"
echo "==================================\n"

# Open browser after a delay
sleep 3
open http://localhost:3000 2>/dev/null || echo "Please manually open: http://localhost:3000"

# Keep monitoring
echo "Monitoring servers... Press Ctrl+C to exit (servers will keep running)\n"
tail -f "$PROJECT_DIR/logs/backend.log" "$PROJECT_DIR/logs/frontend.log"
