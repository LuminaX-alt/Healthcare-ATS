#!/bin/bash

echo "🧪 TESTING LAB REPORTS DISPLAY IN DOCTOR DASHBOARD"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "📋 Step 1: Checking if demo reports are created..."
echo "   Expected: 3 demo reports assigned to doctor@hospital.com"
echo ""

echo "📋 Step 2: Testing API endpoint..."
echo "   Endpoint: GET /api/lab-reports"
echo ""

echo "${YELLOW}🚀 Starting backend server...${NC}"
cd "$(dirname "$0")"

# Kill any existing node processes
pkill -f "node server/index.js" 2>/dev/null

# Start backend
node server/index.js &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait for server to start
sleep 3

echo ""
echo "${YELLOW}🔐 Step 3: Login as doctor and get auth token...${NC}"

# Login to get token
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@hospital.com","password":"doctor123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "${RED}❌ Login failed! Cannot get auth token.${NC}"
  echo "Response: $LOGIN_RESPONSE"
  kill $BACKEND_PID
  exit 1
fi

echo "${GREEN}✅ Login successful!${NC}"
echo "   Token: ${TOKEN:0:20}..."
echo ""

echo "${YELLOW}📊 Step 4: Fetching lab reports for doctor...${NC}"

# Fetch lab reports
REPORTS_RESPONSE=$(curl -s http://localhost:3001/api/lab-reports \
  -H "x-auth-token: $TOKEN")

echo "$REPORTS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$REPORTS_RESPONSE"

# Count reports
REPORT_COUNT=$(echo "$REPORTS_RESPONSE" | grep -o '"count":[0-9]*' | cut -d':' -f2)

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$REPORT_COUNT" -gt "0" ]; then
  echo "${GREEN}✅ SUCCESS! Found $REPORT_COUNT lab report(s)${NC}"
  echo ""
  echo "🎉 Lab reports ARE being returned by the API!"
  echo ""
  echo "If reports still don't show in UI, the issue is in:"
  echo "  1. Frontend fetchLabReports() function"
  echo "  2. State management (labReports state)"
  echo "  3. Component rendering"
else
  echo "${RED}❌ FAIL! No reports found${NC}"
  echo ""
  echo "Possible issues:"
  echo "  1. Demo reports not created"
  echo "  2. Email mismatch (doctor@hospital.com)"
  echo "  3. API filtering issue"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "${YELLOW}🧹 Cleaning up...${NC}"
kill $BACKEND_PID 2>/dev/null
sleep 1

echo ""
echo "✅ Test complete!"
echo ""
echo "Next steps:"
echo "1. Start servers: ./START_WITH_AUTO_SEND.sh"
echo "2. Login as doctor: doctor@hospital.com / doctor123"
echo "3. Click 'Lab Reports' tab"
echo "4. Should see $REPORT_COUNT reports"
