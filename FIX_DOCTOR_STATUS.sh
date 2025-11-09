#!/bin/bash

echo "🔧 FIXING DOCTOR STATUS UPDATE ISSUE"
echo "======================================"
echo ""

# Check servers
echo "1️⃣ Checking servers..."
BACKEND_PID=$(lsof -ti:3001)
FRONTEND_PID=$(lsof -ti:3000)

if [ -z "$BACKEND_PID" ]; then
    echo "❌ Backend server is NOT running on port 3001"
    echo "   Starting backend..."
    cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype/server
    node index.js > /tmp/backend.log 2>&1 &
    sleep 3
    echo "   ✅ Backend started"
else
    echo "✅ Backend server running (PID: $BACKEND_PID)"
fi

if [ -z "$FRONTEND_PID" ]; then
    echo "❌ Frontend server is NOT running on port 3000"
else
    echo "✅ Frontend server running (PID: $FRONTEND_PID)"
fi

echo ""
echo "2️⃣ Testing admin login..."

# Login as admin
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"demo123","role":"admin"}')

TOKEN=$(echo $LOGIN_RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
    echo "❌ Admin login FAILED!"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

echo "✅ Admin login successful!"
echo ""

# Get first doctor
echo "3️⃣ Getting doctor information..."
DOCTORS=$(curl -s http://localhost:3001/api/doctors)
DOCTOR_ID=$(echo $DOCTORS | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['_id'])" 2>/dev/null)
DOCTOR_NAME=$(echo $DOCTORS | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['name'])" 2>/dev/null)

echo "✅ Found doctor: $DOCTOR_NAME (ID: $DOCTOR_ID)"
echo ""

# Test status update
echo "4️⃣ Testing status update to ONLINE..."
UPDATE_RESPONSE=$(curl -s -X PUT http://localhost:3001/api/doctors/$DOCTOR_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"onlineStatus":"online","isOnline":true}')

NEW_STATUS=$(echo $UPDATE_RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin).get('onlineStatus', 'ERROR'))" 2>/dev/null)

if [ "$NEW_STATUS" = "online" ]; then
    echo "✅ Status update to ONLINE successful!"
else
    echo "❌ Status update FAILED!"
    echo "Response: $UPDATE_RESPONSE"
    exit 1
fi

echo ""
echo "======================================"
echo "🎉 ALL BACKEND TESTS PASSED!"
echo ""
echo "📋 INSTRUCTIONS FOR FRONTEND:"
echo ""
echo "1. Open browser to: http://localhost:3000"
echo ""
echo "2. Click 'Login' → Select 'Admin'"
echo ""
echo "3. Use these credentials:"
echo "   Email: admin@demo.com"
echo "   Password: demo123 (or any password)"
echo ""
echo "4. Click 'Login' button"
echo ""
echo "5. After login, go to 'Admin Dashboard'"
echo ""
echo "6. Click on 'Doctor Status' tab"
echo ""
echo "7. Try clicking the status buttons (Online/Busy/Offline)"
echo ""
echo "8. You should now see detailed error messages if anything fails"
echo ""
echo "💡 TIP: Open browser console (F12) to see detailed logs"
echo ""
echo "======================================"
echo ""
echo "🔑 Your Admin Token (for testing):"
echo "$TOKEN"
echo ""
echo "You can test directly with curl:"
echo ""
echo "curl -X PUT http://localhost:3001/api/doctors/$DOCTOR_ID/status \\"
echo "  -H 'Authorization: Bearer $TOKEN' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"onlineStatus\":\"online\",\"isOnline\":true}'"
echo ""
