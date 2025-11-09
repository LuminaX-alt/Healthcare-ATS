#!/bin/bash

# 🚀 SUPER FAST START - No rebuild, just restart services

echo "🚀 SUPER FAST START"
echo "==================="
echo ""

cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype

echo "🛑 Stopping old processes..."
pkill -f "node.*server/index" 2>/dev/null
pkill -f "react-scripts" 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 1

echo "🚀 Starting backend..."
cd server && npm start > ../backend.log 2>&1 &
sleep 3

echo "🎨 Starting frontend..."
cd .. && BROWSER=none npm start > frontend.log 2>&1 &

echo ""
echo "✅ Services starting..."
echo ""
echo "⏳ Waiting 10 seconds for React to compile..."

# Show a countdown
for i in {10..1}; do
  echo -ne "   $i seconds remaining...\r"
  sleep 1
done
echo ""

echo ""
echo "═══════════════════════════════════════"
echo "✅ READY!"
echo "═══════════════════════════════════════"
echo ""
echo "🌐 Opening: http://localhost:3000"
echo ""

open http://localhost:3000

echo "📋 LOGIN:"
echo "   Email: doctor@hospital.com"
echo "   Pass:  doctorpass123"
echo ""
echo "🎉 App should be FAST now!"
echo ""
