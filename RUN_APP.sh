#!/bin/bash

echo "======================================"
echo "Starting Healthcare Application"
echo "======================================"
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

# Kill any existing processes
echo "Cleaning up old processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
sleep 2

# Start MongoDB if not running
echo "Checking MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "Starting MongoDB..."
    brew services start mongodb-community
    sleep 3
fi

# Start Backend
echo "Starting Backend Server..."
cd server
node index.js > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
cd ..
sleep 5

# Check if backend started
if lsof -ti:3001 > /dev/null 2>&1; then
    echo "✅ Backend is running on http://localhost:3001"
else
    echo "❌ Backend failed to start. Check backend.log"
    exit 1
fi

# Start Frontend
echo "Starting Frontend..."
npm start > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo "======================================"
echo "✅ Application is starting!"
echo "======================================"
echo ""
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Wait 30 seconds, then open:"
echo "http://localhost:3000"
echo ""
echo "To stop: kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Logs:"
echo "  Backend:  tail -f backend.log"
echo "  Frontend: tail -f frontend.log"
echo ""
