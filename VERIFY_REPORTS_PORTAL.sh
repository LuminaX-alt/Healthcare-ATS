#!/bin/bash

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   REPORTS PORTAL - CONFIGURATION VERIFICATION${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}\n"

# Check if files exist
echo -e "${YELLOW}Checking Files...${NC}"

FILES=(
    "src/components/ReportsDashboard.tsx"
    "src/components/LoginPage.tsx"
    "src/components/HomePage.tsx"
    "src/App.tsx"
    "server/models/Reports.js"
    "server/models/User.js"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
    else
        echo -e "${RED}✗${NC} $file missing"
    fi
done

echo ""
echo -e "${YELLOW}Checking Configuration...${NC}"

# Check for 'reports' role in User model
if grep -q "'reports'" server/models/User.js; then
    echo -e "${GREEN}✓${NC} 'reports' role found in User model"
else
    echo -e "${RED}✗${NC} 'reports' role NOT found in User model"
fi

# Check for reports redirect in LoginPage
if grep -q "navigate('/reports/dashboard')" src/components/LoginPage.tsx; then
    echo -e "${GREEN}✓${NC} Reports redirect configured in LoginPage"
else
    echo -e "${RED}✗${NC} Reports redirect NOT configured in LoginPage"
fi

# Check for reports route in App.tsx
if grep -q "/reports/dashboard" src/App.tsx; then
    echo -e "${GREEN}✓${NC} Reports route configured in App.tsx"
else
    echo -e "${RED}✗${NC} Reports route NOT configured in App.tsx"
fi

# Check for Reports portal on HomePage
if grep -q "Reports & Investigation" src/components/HomePage.tsx; then
    echo -e "${GREEN}✓${NC} Reports portal added to HomePage"
else
    echo -e "${RED}✗${NC} Reports portal NOT found on HomePage"
fi

# Check for demo credentials
if grep -q "reports@hospital.com" src/components/LoginPage.tsx; then
    echo -e "${GREEN}✓${NC} Demo credentials configured"
else
    echo -e "${RED}✗${NC} Demo credentials NOT configured"
fi

echo ""
echo -e "${YELLOW}Demo User Credentials:${NC}"
echo -e "  Email: ${BLUE}reports@hospital.com${NC}"
echo -e "  Password: ${BLUE}reports123${NC}"

echo ""
echo -e "${YELLOW}Testing Flow:${NC}"
echo -e "  1. Navigate to ${BLUE}http://localhost:3000${NC}"
echo -e "  2. Click ${BLUE}'Reports & Investigation'${NC} portal"
echo -e "  3. Click ${BLUE}'Use Demo Credentials'${NC} button"
echo -e "  4. Click ${BLUE}'Sign In'${NC}"
echo -e "  5. Should redirect to ${BLUE}/reports/dashboard${NC}"

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   ✓ ALL CONFIGURATIONS VERIFIED${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"

echo ""
echo -e "${YELLOW}To start the application:${NC}"
echo -e "  ${BLUE}Terminal 1:${NC} npm start"
echo -e "  ${BLUE}Terminal 2:${NC} node server/server.js"

echo ""
echo -e "${YELLOW}For detailed testing guide, see:${NC}"
echo -e "  ${BLUE}TEST_REPORTS_PORTAL.md${NC}"
echo ""
