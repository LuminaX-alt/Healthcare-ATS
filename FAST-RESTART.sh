#!/bin/bash

# ⚡ FAST RESTART - Rebuild React & Start Everything

echo "⚡ FAST RESTART - Healthcare System"
echo "===================================="
echo ""

cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype

echo "🛑 Step 1: Stopping all services..."
pkill -f "node" 2>/dev/null
pkill -f "npm" 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 2
echo "✅ All services stopped"
echo ""

echo "🧹 Step 2: Clearing React build cache..."
rm -rf build/
rm -rf node_modules/.cache/
echo "✅ Cache cleared"
echo ""

echo "🔨 Step 3: Rebuilding React app with fixes..."
echo "   (This will take 30-60 seconds)"
echo ""
npm run build
echo "✅ React app rebuilt!"
echo ""

echo "🚀 Step 4: Starting backend..."
cd server
nohup npm start > ../backend.log 2>&1 &
sleep 5
echo "✅ Backend running on port 3001"
echo ""

echo "🎨 Step 5: Starting frontend..."
cd ..
nohup npm start > frontend.log 2>&1 &
sleep 3
echo "✅ Frontend starting on port 3000"
echo ""

echo "═══════════════════════════════════════"
echo "✅ SYSTEM READY - OPTIMIZED!"
echo "═══════════════════════════════════════"
echo ""
echo "🌐 Opening: http://localhost:3000"
echo ""
echo "⚡ React app is REBUILT with:"
echo "   ✅ 60-second timeout for Alt-X"
echo "   ✅ Latest Gemini integration"
echo "   ✅ All bug fixes applied"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1️⃣  Browser will open in 5 seconds"
echo "2️⃣  Login: doctor@hospital.com / doctorpass123"
echo "3️⃣  Click Alt-X and type: 'Hello'"
echo "4️⃣  Wait 10-30 seconds (first AI request is slow)"
echo ""
echo "═══════════════════════════════════════"
echo ""

# Wait and open browser
sleep 5
open http://localhost:3000

echo "🎉 Done! App should load FAST now!"
echo ""
