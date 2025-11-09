#!/bin/bash

# 🤖 CLAUDE AI SETUP SCRIPT
# This script helps you set up Claude AI for Alt-X

echo "🤖 CLAUDE AI SETUP FOR ALT-X"
echo "=============================="
echo ""

# Check if API key is already set
if [ -n "$CLAUDE_API_KEY" ]; then
    echo "✅ CLAUDE_API_KEY is already set!"
    echo "   Key starts with: ${CLAUDE_API_KEY:0:12}..."
    echo ""
else
    echo "❌ CLAUDE_API_KEY is not set"
    echo ""
    echo "📋 TO SET YOUR API KEY:"
    echo ""
    echo "1. Get your key from: https://console.anthropic.com/"
    echo "2. Run this command:"
    echo "   export CLAUDE_API_KEY='your-api-key-here'"
    echo ""
    echo "3. Then run this script again!"
    echo ""
    exit 1
fi

# Test Claude API connection
echo "🔍 Testing Claude API connection..."
echo ""

cd "$(dirname "$0")/server"

# Start server in background
node index.js > ../claude-test.log 2>&1 &
SERVER_PID=$!

echo "⏳ Waiting for server to start..."
sleep 5

# Test status endpoint
echo "📡 Checking Claude status..."
STATUS=$(curl -s http://localhost:3001/api/lumina-ai-local/status)

if echo "$STATUS" | grep -q '"success":true'; then
    echo ""
    echo "✅ SUCCESS! Claude AI is configured correctly!"
    echo ""
    echo "$STATUS" | python3 -m json.tool 2>/dev/null || echo "$STATUS"
    echo ""
    echo "🎉 Alt-X is now powered by Claude AI!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Open your app: http://localhost:3000"
    echo "2. Login as doctor"
    echo "3. Click Alt-X tab"
    echo "4. Ask any question!"
else
    echo ""
    echo "❌ ERROR: Claude API connection failed"
    echo ""
    echo "$STATUS"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "1. Check your API key is correct"
    echo "2. Check internet connection"
    echo "3. Check server logs: tail -f claude-test.log"
fi

# Kill test server
kill $SERVER_PID 2>/dev/null

echo ""
echo "Server stopped. Start it again with:"
echo "  cd server && node index.js"
