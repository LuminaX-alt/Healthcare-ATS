#!/bin/bash

# 🚨 EMERGENCY RESTART - Fix Alt-X Timeout

echo "🚨 Emergency Restart - Fixing Alt-X..."
echo ""

cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype

# 1. Kill everything
echo "🔄 Stopping old processes..."
pkill -f "node.*index.js" 2>/dev/null
lsof -ti:3001 2>/dev/null | xargs kill -9 2>/dev/null
lsof -ti:3000 2>/dev/null | xargs kill -9 2>/dev/null
sleep 2

# 2. Start backend
echo "📦 Starting backend with Gemini AI..."
cd server
npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend starting (PID: $BACKEND_PID)"

# 3. Wait for backend
echo "⏳ Waiting for backend to initialize..."
sleep 8

# 4. Test backend
echo "🧪 Testing backend..."
curl -s http://localhost:3001/api/doctors > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Backend is ready!"
else
    echo "⚠️  Backend still starting... (may take a moment)"
fi

echo ""
echo "═══════════════════════════════════════════════════"
echo "🎉 BACKEND RESTARTED WITH GEMINI AI!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "📋 WHAT TO DO NOW:"
echo ""
echo "1. In your browser (Alt-X tab):"
echo "   Press: Cmd + Shift + R  (hard refresh)"
echo ""
echo "2. Then test Alt-X:"
echo "   Type: 'Hello'"
echo "   Wait: 10-30 seconds (first request)"
echo "   ✅ Should work now!"
echo ""
echo "🔍 Backend log: tail -f backend.log"
echo ""
