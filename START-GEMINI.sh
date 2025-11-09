#!/bin/bash

# 🔧 COMPLETE GEMINI FIX - Automated

echo "🔧 GEMINI AI - COMPLETE FIX"
echo "============================"
echo ""

cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype

echo "🛑 Step 1: Stopping all services..."
pkill -f "node.*index.js" 2>/dev/null
pkill -f "npm start" 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 2
echo "✅ Services stopped"
echo ""

echo "🧪 Step 2: Testing Gemini API..."
echo ""
node test-gemini-quick.js
echo ""

echo "🚀 Step 3: Starting backend with Gemini..."
cd server
nohup npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
sleep 5
echo "✅ Backend started (PID: $BACKEND_PID)"
echo ""

echo "🎨 Step 4: Starting frontend..."
cd ..
nohup npm start > frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 3
echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo ""

echo "═══════════════════════════════════════"
echo "✅ SYSTEM READY!"
echo "═══════════════════════════════════════"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:3001"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1️⃣  In your browser, press: Cmd + Shift + R"
echo "   (This loads the 60-second timeout fix)"
echo ""
echo "2️⃣  Login as doctor:"
echo "   Email: doctor@hospital.com"
echo "   Pass:  doctorpass123"
echo ""
echo "3️⃣  Click Alt-X and type: 'Hello'"
echo ""
echo "4️⃣  Wait 10-30 seconds for first response"
echo ""
echo "⏱️  First AI response is ALWAYS slow (cold start)"
echo "   After that, responses are faster!"
echo ""
echo "═══════════════════════════════════════"
echo ""

# Wait a bit then open browser
sleep 5
open http://localhost:3000

echo "🎉 Browser opened! Follow the steps above!"
echo ""
