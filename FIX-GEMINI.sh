#!/bin/bash

# 🔧 GEMINI FIX - Test API and Restart Backend

echo "🔧 GEMINI API FIX SCRIPT"
echo "========================"
echo ""

cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype

echo "🧪 Step 1: Testing Gemini API..."
echo "--------------------------------"
node test-gemini-api.js
echo ""

read -p "Did the test pass? (y/n): " test_passed

if [ "$test_passed" != "y" ]; then
  echo ""
  echo "❌ Gemini API test failed!"
  echo ""
  echo "🔧 FIXES:"
  echo "1. Get a NEW API key from: https://aistudio.google.com/app/apikey"
  echo "2. Update server/.env file with: GEMINI_API_KEY=your_new_key"
  echo "3. Run this script again"
  echo ""
  exit 1
fi

echo ""
echo "✅ Gemini API is working!"
echo ""

echo "🔄 Step 2: Restarting backend with fix..."
echo "-------------------------------------------"

# Kill old backend
echo "🛑 Stopping old backend..."
pkill -f "node.*server/index.js" 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
sleep 2

# Start new backend
echo "🚀 Starting backend with Gemini AI..."
cd server
nohup npm start > ../backend.log 2>&1 &
sleep 5

echo ""
echo "✅ Backend restarted!"
echo ""

echo "📋 Step 3: Next actions..."
echo "---------------------------"
echo ""
echo "1️⃣  In your browser, do a HARD REFRESH:"
echo "    Press: Cmd + Shift + R"
echo ""
echo "2️⃣  Go to Alt-X and try sending: 'Hello'"
echo ""
echo "3️⃣  Wait 10-30 seconds for first response"
echo ""
echo "✅ Done!"
