#!/bin/bash

clear
echo "╔════════════════════════════════════════════╗"
echo "║   🏥 HEALTHCARE APPLICATION LAUNCHER       ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Function to check if a port is in use
check_port() {
    lsof -i:$1 > /dev/null 2>&1
    return $?
}

# Kill existing processes
echo "🧹 Cleaning up..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
sleep 1

# Check MongoDB
echo "🔍 Checking MongoDB..."
if pgrep -x "mongod" > /dev/null; then
    echo "   ✅ MongoDB is running"
else
    echo "   ⚠️  Starting MongoDB..."
    brew services start mongodb-community > /dev/null 2>&1
    sleep 3
    echo "   ✅ MongoDB started"
fi
echo ""

# Start Backend
echo "🔵 Starting Backend Server..."
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype/server
node index.js > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "   Process ID: $BACKEND_PID"

# Wait and check backend
sleep 3
if check_port 3001; then
    echo "   ✅ Backend running on port 3001"
else
    echo "   ❌ Backend failed to start. Check /tmp/backend.log"
    exit 1
fi
echo ""

# Start Frontend
echo "🟢 Starting Frontend Server..."
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype
BROWSER=none npm start > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Process ID: $FRONTEND_PID"
echo "   ⏳ Compiling... (this takes 30-60 seconds)"
echo ""

# Wait for frontend
echo "⏳ Waiting for compilation..."
for i in {1..60}; do
    if check_port 3000; then
        echo "   ✅ Frontend running on port 3000"
        break
    fi
    sleep 1
done
echo ""

# Success message
echo "╔════════════════════════════════════════════╗"
echo "║           🎉 APPLICATION READY!            ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "📋 LOGIN CREDENTIALS:"
echo ""
echo "   👨‍⚕️ Doctor:"
echo "      Email: doctor@hospital.com"
echo "      Password: doctor123"
echo ""
echo "   👨‍💼 Admin:"
echo "      Email: admin@hospital.com"
echo "      Password: admin123"
echo ""
echo "   👤 Patient:"
echo "      Phone: +1234567890"
echo "      OTP: 123456"
echo ""
echo "   💊 Pharmacist:"
echo "      Email: pharmacist@hospital.com"
echo "      Password: pharmacist123"
echo ""
echo "📊 Process IDs:"
echo "   Backend:  $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "📝 Logs:"
echo "   tail -f /tmp/backend.log"
echo "   tail -f /tmp/frontend.log"
echo ""
echo "🛑 To stop: pkill -P $$ or run ./STOP.sh"
echo ""
echo "🌐 Opening browser..."
sleep 2
open http://localhost:3000

echo ""
echo "✨ All systems operational! Press Ctrl+C to stop."
echo ""

# Wait for processes
wait
