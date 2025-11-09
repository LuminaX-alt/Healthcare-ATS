#!/bin/bash

echo "🔄 FULL SYSTEM SYNCHRONIZATION TEST"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Test function
test_endpoint() {
    local name=$1
    local url=$2
    local expected=$3
    
    echo -n "Testing $name... "
    response=$(curl -s "$url" 2>&1)
    
    if echo "$response" | grep -q "$expected"; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "   Response: ${response:0:100}"
        ((FAILED++))
        return 1
    fi
}

# Check if servers are running
echo -e "${BLUE}🔍 Checking Services...${NC}"
echo "------------------------"

if lsof -ti:3001 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend running on port 3001${NC}"
else
    echo -e "${RED}❌ Backend NOT running on port 3001${NC}"
    echo "   Start with: cd server && npm start"
    exit 1
fi

if lsof -ti:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend running on port 3000${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend NOT running on port 3000${NC}"
    echo "   Start with: npm start"
fi

echo ""
echo -e "${BLUE}📡 Backend API Tests${NC}"
echo "--------------------"

# Test medications API
test_endpoint "Medications API" "http://localhost:3001/api/medications" "id"

echo ""
echo -e "${BLUE}🤖 AI Service Tests${NC}"
echo "-------------------"

# Test AI status
test_endpoint "AI Status" "http://localhost:3001/api/lumina-ai-local/status" "online"

# Test AI query
echo -n "Testing AI Query Response... "
AI_RESPONSE=$(curl -s -X POST http://localhost:3001/api/lumina-ai-local/query \
  -H "Content-Type: application/json" \
  -d '{"query":"Hello, who are you?"}' 2>&1)

if echo "$AI_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
    
    # Extract and show a snippet of the AI response
    AI_ANSWER=$(echo "$AI_RESPONSE" | grep -o '"answer":"[^"]*"' | head -1 | cut -d'"' -f4 | cut -c1-80)
    echo -e "   ${CYAN}AI says: ${AI_ANSWER}...${NC}"
else
    echo -e "${RED}❌ FAIL${NC}"
    echo "   Response: ${AI_RESPONSE:0:200}"
    ((FAILED++))
fi

# Test AI with medical question
echo -n "Testing AI Medical Query... "
MEDICAL_RESPONSE=$(curl -s -X POST http://localhost:3001/api/lumina-ai-local/query \
  -H "Content-Type: application/json" \
  -d '{"query":"What is paracetamol used for?"}' 2>&1)

if echo "$MEDICAL_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}"
    ((FAILED++))
fi

echo ""
echo -e "${BLUE}🔐 Authentication Tests${NC}"
echo "-----------------------"

# Test Doctor Login
echo -n "Testing Doctor Login... "
AUTH_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@hospital.com","password":"doctor123","role":"doctor"}' 2>&1)

if echo "$AUTH_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
    
    # Extract token for further tests
    TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
else
    echo -e "${RED}❌ FAIL${NC}"
    echo "   Response: ${AUTH_RESPONSE:0:100}"
    ((FAILED++))
fi

# Test Admin Login
echo -n "Testing Admin Login... "
ADMIN_AUTH=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hospital.com","password":"admin123","role":"admin"}' 2>&1)

if echo "$ADMIN_AUTH" | grep -q "token"; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}"
    ((FAILED++))
fi

# Test Pharmacist Login
echo -n "Testing Pharmacist Login... "
PHARM_AUTH=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"pharmacist@hospital.com","password":"pharmacy123","role":"pharmacist"}' 2>&1)

if echo "$PHARM_AUTH" | grep -q "token"; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}"
    ((FAILED++))
fi

# Test Reports Login
echo -n "Testing Reports Staff Login... "
REPORTS_AUTH=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"reports@hospital.com","password":"reports123","role":"reports"}' 2>&1)

if echo "$REPORTS_AUTH" | grep -q "token"; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}"
    ((FAILED++))
fi

# Test Patient Login
echo -n "Testing Patient Login... "
PATIENT_AUTH=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@hospital.com","password":"patient123","role":"patient"}' 2>&1)

if echo "$PATIENT_AUTH" | grep -q "token"; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}"
    ((FAILED++))
fi

echo ""
echo -e "${BLUE}🧪 Lab Reports Tests${NC}"
echo "--------------------"

if [ ! -z "$TOKEN" ]; then
    # Test lab reports API
    echo -n "Testing Lab Reports API... "
    LAB_RESPONSE=$(curl -s http://localhost:3001/api/lab-reports \
      -H "Authorization: Bearer $TOKEN" 2>&1)
    
    if echo "$LAB_RESPONSE" | grep -q "id\|reportId\|REP-"; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
        
        # Count reports
        REPORT_COUNT=$(echo "$LAB_RESPONSE" | grep -o "REP-DEMO" | wc -l | tr -d ' ')
        echo -e "   ${CYAN}Found $REPORT_COUNT demo reports${NC}"
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAILED++))
    fi
else
    echo -e "${YELLOW}⚠️  Skipping Lab Reports test (no auth token)${NC}"
fi

echo ""
echo -e "${BLUE}💊 Prescription System Tests${NC}"
echo "----------------------------"

# Test doctors API
test_endpoint "Doctors API" "http://localhost:3001/api/doctors" "id\|email"

echo ""
echo -e "${BLUE}📊 Test Summary${NC}"
echo "==============="
TOTAL=$((PASSED + FAILED))
PERCENTAGE=$((PASSED * 100 / TOTAL))

echo -e "Passed: ${GREEN}$PASSED${NC} / $TOTAL"
echo -e "Failed: ${RED}$FAILED${NC} / $TOTAL"
echo -e "Success Rate: ${CYAN}${PERCENTAGE}%${NC}"

echo ""
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    echo -e "${GREEN}✅ System is fully synchronized and working!${NC}"
    echo ""
    echo -e "${CYAN}Next Steps:${NC}"
    echo "1. Open http://localhost:3000 in your browser"
    echo "2. Test each portal manually:"
    echo "   - Doctor: doctor@hospital.com / doctor123"
    echo "   - Admin: admin@hospital.com / admin123"
    echo "   - Pharmacist: pharmacist@hospital.com / pharmacy123"
    echo "   - Reports: reports@hospital.com / reports123"
    echo "   - Patient: patient@hospital.com / patient123"
    echo "3. Test Alt-X AI in Doctor portal"
    echo ""
    exit 0
else
    echo -e "${RED}⚠️  SOME TESTS FAILED${NC}"
    echo -e "${YELLOW}Please check the errors above and fix them.${NC}"
    echo ""
    exit 1
fi
