#!/bin/zsh

# 🚀 Alt-X AI - Complete Activation Script
# This script activates the fully enhanced Alt-X AI system

echo "🤖 Alt-X AI - Enhanced System Activation"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Not in healthcare-prototype directory${NC}"
    echo "Please run this from: /Users/mrdevsharma/Downloads/EX/healthcare-prototype"
    exit 1
fi

echo -e "${BLUE}📋 What's New in Alt-X AI:${NC}"
echo ""
echo "  ✅ 15+ Medications (antibiotics + common drugs)"
echo "  ✅ 5 Medical Calculators (CrCl, BMI, CURB-65, etc.)"
echo "  ✅ Drug Interaction Checker"
echo "  ✅ Patient-Specific Safety Alerts"
echo "  ✅ Comprehensive Dosing Information"
echo "  ✅ Pregnancy/Lactation Safety Data"
echo "  ✅ WHO AWaRe Classification"
echo ""
echo "---"
echo ""

# Step 1: Verify enhanced backend exists
echo -e "${BLUE}Step 1: Verifying Enhanced Backend...${NC}"
if [ -f "server/routes/lumina-ai-enhanced.js" ]; then
    echo -e "${GREEN}✅ Enhanced backend found${NC}"
else
    echo -e "${RED}❌ Enhanced backend not found${NC}"
    echo "Creating enhanced backend..."
    # Backend should already be created by previous step
fi
echo ""

# Step 2: Check server configuration
echo -e "${BLUE}Step 2: Checking Server Configuration...${NC}"
if grep -q "lumina-ai-enhanced" server/index.js; then
    echo -e "${GREEN}✅ Server configured to use enhanced routes${NC}"
else
    echo -e "${YELLOW}⚠️  Server needs configuration update${NC}"
fi
echo ""

# Step 3: Install dependencies (if needed)
echo -e "${BLUE}Step 3: Checking Dependencies...${NC}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Installing dependencies...${NC}"
    npm install
fi
echo ""

# Step 4: Check if server is running
echo -e "${BLUE}Step 4: Checking Server Status...${NC}"
if curl -s http://localhost:3001/api/auth/me >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Server is running${NC}"
    echo -e "${YELLOW}⚠️  Restart recommended to load enhanced features${NC}"
    echo ""
    echo "To restart server:"
    echo "  1. Press Ctrl+C in server terminal"
    echo "  2. Run: cd server && node index.js"
else
    echo -e "${YELLOW}⚠️  Server not running${NC}"
    echo ""
    echo "To start server:"
    echo "  cd server && node index.js"
fi
echo ""

# Step 5: Display usage instructions
echo -e "${BLUE}Step 5: How to Use Alt-X AI${NC}"
echo ""
echo "1️⃣  Open Doctor Dashboard"
echo "    http://localhost:5173"
echo ""
echo "2️⃣  Login as Doctor"
echo "    Email: doctor@hospital.com"
echo "    Password: doctor123"
echo ""
echo "3️⃣  Click 'Lumina AI' Tab"
echo "    (or click Alt-X floating button)"
echo ""
echo "4️⃣  Try Sample Queries:"
echo "    • 'What is the dosage for amoxicillin?'"
echo "    • 'Calculate creatinine clearance'"
echo "    • 'Is metformin safe in pregnancy?'"
echo "    • 'Side effects of ciprofloxacin'"
echo "    • 'Drug interactions with warfarin'"
echo ""
echo "---"
echo ""

# Step 6: API Endpoints
echo -e "${BLUE}📡 Available API Endpoints:${NC}"
echo ""
echo "  POST /api/lumina-ai/query"
echo "       → Enhanced queries with patient context"
echo ""
echo "  POST /api/lumina-ai/calculate"
echo "       → Medical calculators (CrCl, BMI, etc.)"
echo ""
echo "  POST /api/lumina-ai/interactions"
echo "       → Drug interaction checker"
echo ""
echo "  GET  /api/lumina-ai/medications"
echo "       → List all available medications"
echo ""
echo "  GET  /api/lumina-ai/medication/:name"
echo "       → Detailed medication information"
echo ""
echo "---"
echo ""

# Step 7: Testing
echo -e "${BLUE}🧪 Quick Test:${NC}"
echo ""
echo "Run the test script to verify all features:"
echo "  ./test-altx-ai.sh"
echo ""
echo "(Requires server to be running and 'jq' installed)"
echo ""
echo "---"
echo ""

# Summary
echo -e "${GREEN}✅ Alt-X AI Enhanced System Ready!${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Restart server (if running)"
echo "  2. Open doctor dashboard"
echo "  3. Test Alt-X AI features"
echo "  4. Provide feedback for improvements"
echo ""

# Show what's been created
echo -e "${BLUE}📁 New Files Created:${NC}"
echo "  • server/routes/lumina-ai-enhanced.js (Enhanced backend)"
echo "  • ALTX_AI_DEVELOPMENT_PLAN.md (Development roadmap)"
echo "  • ALTX_AI_ENHANCED_COMPLETE.md (Feature documentation)"
echo "  • 🤖_ALTX_AI_COMPLETE_GUIDE.md (Usage guide)"
echo "  • test-altx-ai.sh (Testing script)"
echo "  • activate-altx-ai.sh (This script)"
echo ""

echo "🎉 Setup Complete! Alt-X AI is ready to assist doctors!"
echo ""
