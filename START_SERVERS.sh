#!/bin/bash

echo "🚀 Starting Healthcare Application..."
echo ""

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "node index.js" 2>/dev/null
pkill -f "react-scripts" 2>/dev/null
lsof -ti:3000 -ti:3001 | xargs kill -9 2>/dev/null
sleep 2

# Start backend
echo "🔵 Starting Backend Server (Port 3001)..."
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype/server
node index.js &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait for backend to start
sleep 3

# Start frontend
echo "🟢 Starting Frontend Server (Port 3000)..."
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype
npm start &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

echo ""
echo "✅ Servers are starting..."
echo ""
echo "📝 Important Information:"
echo "   - Backend: http://localhost:3001"
echo "   - Frontend: http://localhost:3000"
echo ""
echo "⏳ Wait 30-60 seconds for compilation..."
echo "   Browser will open automatically"
echo ""
echo "🛑 To stop servers, press Ctrl+C or run: ./STOP.sh"
echo ""
echo "📋 Login Credentials:"
echo "   Admin: admin@hospital.com / admin123"
echo "   Doctor: doctor@hospital.com / doctor123"
echo "   Patient: +1234567890 / OTP: 123456"
echo ""

# Wait for both processes
wait
