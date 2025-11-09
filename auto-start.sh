#!/bin/bash

echo "🚀 AUTO-STARTING HEALTHCARE APPLICATION"
echo "========================================"

# Kill existing processes
echo "🧹 Cleaning up..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
pkill -f "node index.js" 2>/dev/null
pkill -f "react-scripts" 2>/dev/null
sleep 2

# Start MongoDB
echo "🔧 Starting MongoDB..."
brew services start mongodb-community 2>/dev/null
sleep 3

# Start Backend
echo "🔵 Starting Backend Server (Port 3001)..."
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype/server
nohup node index.js > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "   ✅ Backend PID: $BACKEND_PID"
sleep 5

# Check backend logs
if grep -q "MongoDB connected" /tmp/backend.log 2>/dev/null; then
    echo "   ✅ Backend connected to MongoDB"
else
    echo "   ⚠️  Backend may have issues, check /tmp/backend.log"
fi

# Start Frontend
echo "🟢 Starting Frontend Server (Port 3000)..."
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype
BROWSER=none nohup npm start > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   ✅ Frontend PID: $FRONTEND_PID"

echo ""
echo "✅ SERVERS ARE STARTING!"
echo ""
echo "📋 Process IDs:"
echo "   Backend: $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "⏳ Wait 30-60 seconds for compilation..."
echo ""
echo "📋 LOGIN CREDENTIALS:"
echo "   Admin:    admin@hospital.com / admin123"
echo "   Doctor:   doctor@hospital.com / doctor123"
echo "   Patient:  +1234567890 / OTP: 123456"
echo ""
echo "📊 Check logs:"
echo "   tail -f /tmp/backend.log"
echo "   tail -f /tmp/frontend.log"
echo ""
echo "🛑 To stop: ./STOP.sh"
