#!/bin/bash

echo "🚀 Starting Healthcare App with Auto-Send Lab Reports..."
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

# Start backend in background
echo "📡 Starting Backend Server..."
node server/index.js &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait for backend to start
sleep 3

# Start frontend
echo "🌐 Starting Frontend..."
npm start

# When frontend is closed, kill backend
echo ""
echo "🛑 Shutting down servers..."
kill $BACKEND_PID 2>/dev/null
echo "✅ Servers stopped"
