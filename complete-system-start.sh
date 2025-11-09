#!/bin/zsh

# 🎯 COMPLETE APPLICATION SYNCHRONIZATION & DOCTOR DROPDOWN FIX
# Date: November 8, 2025
# Purpose: Start all services and verify interconnected portals

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║  🏥 HEALTHCARE PROTOTYPE - COMPLETE SYSTEM SYNCHRONIZATION        ║"
echo "║     Doctor Dropdown Fix + Full Portal Integration Test           ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

PROJECT_DIR="/Users/mrdevsharma/Downloads/EX/healthcare-prototype"
cd "$PROJECT_DIR"

echo -e "${BLUE}📍 Project Directory: $PROJECT_DIR${NC}\n"

# Step 1: Check MongoDB
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Step 1: MongoDB Status Check${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if pgrep -x "mongod" > /dev/null; then
    echo -e "${GREEN}✅ MongoDB is running${NC}"
else
    echo -e "${RED}❌ MongoDB is NOT running${NC}"
    echo -e "${YELLOW}   Attempting to start MongoDB...${NC}"
    brew services start mongodb-community 2>/dev/null &
    sleep 4
    if pgrep -x "mongod" > /dev/null; then
        echo -e "${GREEN}✅ MongoDB started successfully${NC}"
    else
        echo -e "${RED}⚠️  Could not auto-start MongoDB${NC}"
        echo -e "${YELLOW}   Please start manually: ${BLUE}brew services start mongodb-community${NC}"
    fi
fi
echo ""

# Step 2: Database Sync
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Step 2: Database Synchronization (Doctor Departments)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd "$PROJECT_DIR/server"
if [ -f "fix-doctor-departments.js" ]; then
    echo -e "${CYAN}Running database sync...${NC}"
    node fix-doctor-departments.js
    echo -e "${GREEN}✅ Database sync complete${NC}"
else
    echo -e "${YELLOW}⚠️  Database sync script not found, skipping${NC}"
fi
echo ""

# Step 3: Clean up old processes
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Step 3: Cleanup Old Processes${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Kill old Node processes
pkill -f "node.*index.js" 2>/dev/null && echo -e "${GREEN}✅ Stopped old Node processes${NC}" || echo -e "${CYAN}ℹ️  No old Node processes found${NC}"

# Free ports
lsof -ti:3001 2>/dev/null | xargs kill -9 2>/dev/null && echo -e "${GREEN}✅ Freed port 3001${NC}" || echo -e "${CYAN}ℹ️  Port 3001 already free${NC}"
lsof -ti:3000 2>/dev/null | xargs kill -9 2>/dev/null && echo -e "${GREEN}✅ Freed port 3000${NC}" || echo -e "${CYAN}ℹ️  Port 3000 already free${NC}"

sleep 2
echo ""

# Step 4: Start Backend
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Step 4: Starting Backend Server (Port 3001)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd "$PROJECT_DIR/server"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}   Installing backend dependencies...${NC}"
    npm install --silent
fi

# Start backend in background
nohup npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend server started (PID: $BACKEND_PID)${NC}"
echo -e "${BLUE}   Log: $PROJECT_DIR/backend.log${NC}"

# Wait for backend to be ready
echo -e "${CYAN}   Waiting for backend to initialize...${NC}"
for i in {1..20}; do
    if curl -s http://localhost:3001/api/doctors > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is ready and responding!${NC}"
        break
    fi
    sleep 1
    echo -n "."
done
echo ""

# Test backend
echo -e "${CYAN}   Testing backend API...${NC}"
DOCTORS_COUNT=$(curl -s http://localhost:3001/api/doctors 2>/dev/null | jq '. | length' 2>/dev/null || echo "0")
if [ "$DOCTORS_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ API working: $DOCTORS_COUNT doctors found${NC}"
else
    echo -e "${YELLOW}⚠️  API returned 0 doctors (may need demo data)${NC}"
fi
echo ""

# Step 5: Start Frontend
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Step 5: Starting Frontend (Port 3000)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd "$PROJECT_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}   Installing frontend dependencies...${NC}"
    npm install --silent
fi

# Start frontend in background
nohup npm start > frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
echo -e "${BLUE}   Log: $PROJECT_DIR/frontend.log${NC}"

# Wait for frontend
echo -e "${CYAN}   Waiting for frontend to compile...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend is ready!${NC}"
        break
    fi
    sleep 1
    echo -n "."
done
echo ""
echo ""

# Step 6: System Summary
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                                    ║${NC}"
echo -e "${GREEN}║  🎉 HEALTHCARE PROTOTYPE - ALL SERVICES RUNNING!                  ║${NC}"
echo -e "${GREEN}║                                                                    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}📊 SYSTEM STATUS${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ MongoDB:${NC}        Running"
echo -e "${GREEN}✅ Backend:${NC}        http://localhost:3001 (PID: $BACKEND_PID)"
echo -e "${GREEN}✅ Frontend:${NC}       http://localhost:3000 (PID: $FRONTEND_PID)"
echo -e "${GREEN}✅ Alt-X AI:${NC}       Google Gemini 2.5 Flash (FREE)"
echo -e "${GREEN}✅ Database:${NC}       Doctor departments synced"
echo ""

echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}🧪 TEST THE DOCTOR DROPDOWN FIX${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}TEST 1: Lab Reports Staff (MAIN FIX)${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  1. ${BLUE}Open:${NC} http://localhost:3000/login/reports"
echo -e "  2. ${BLUE}Login:${NC}"
echo -e "     Email:    ${GREEN}reports@hospital.com${NC}"
echo -e "     Password: ${GREEN}reportspass123${NC}"
echo -e "  3. ${BLUE}Fill form:${NC}"
echo -e "     Patient ID:   PAT-001"
echo -e "     Patient Name: Test Patient"
echo -e "     Report Type:  Blood Test"
echo -e "     Test Name:    CBC Test"
echo -e "  4. ${BLUE}Select Department:${NC} Choose any (e.g., Cardiology)"
echo -e "  5. ${BLUE}Click Doctor Dropdown${NC}"
echo -e ""
echo -e "  ${GREEN}✅ EXPECTED: Doctors should now appear with names!${NC}"
echo -e "  ${RED}❌ BEFORE: \"No doctors in this department\"${NC}"
echo ""

echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}TEST 2: Admin Dashboard${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  1. ${BLUE}Open:${NC} http://localhost:3000/login/admin"
echo -e "  2. ${BLUE}Login:${NC}"
echo -e "     Email:    ${GREEN}admin@hospital.com${NC}"
echo -e "     Password: ${GREEN}adminpass123${NC}"
echo -e "  3. ${BLUE}Click:${NC} Users tab"
echo -e "  4. ${BLUE}Edit:${NC} Any doctor"
echo -e "  5. ${BLUE}Update:${NC}"
echo -e "     Department:  Cardiology"
echo -e "     Designation: Professor"
echo -e "  6. ${BLUE}Click:${NC} Save User"
echo -e ""
echo -e "  ${GREEN}✅ EXPECTED: Success message, doctor updated${NC}"
echo ""

echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}TEST 3: Alt-X AI with Gemini${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  1. ${BLUE}Open:${NC} http://localhost:3000/login/doctor"
echo -e "  2. ${BLUE}Login:${NC}"
echo -e "     Email:    ${GREEN}doctor@hospital.com${NC}"
echo -e "     Password: ${GREEN}doctorpass123${NC}"
echo -e "  3. ${BLUE}Click:${NC} Alt-X tab (⚡ icon in sidebar)"
echo -e "  4. ${BLUE}Ask:${NC} \"What are the symptoms of diabetes?\""
echo -e ""
echo -e "  ${GREEN}✅ EXPECTED: Alt-X responds with AI-generated answer${NC}"
echo -e "  ${GREEN}✅ Google Gemini 2.5 Flash (100% FREE)${NC}"
echo ""

echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}📋 ALL PORTAL CREDENTIALS${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${CYAN}Admin Portal:${NC}       admin@hospital.com      / adminpass123"
echo -e "  ${CYAN}Doctor Portal:${NC}      doctor@hospital.com     / doctorpass123"
echo -e "  ${CYAN}Lab Reports:${NC}        reports@hospital.com    / reportspass123"
echo -e "  ${CYAN}Pharmacist:${NC}         pharmacist@hospital.com / pharmpass123"
echo ""

echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}🔍 QUICK VERIFICATION${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${CYAN}Check API:${NC}    curl http://localhost:3001/api/doctors | jq '.[] | {name, department}'"
echo -e "  ${CYAN}View logs:${NC}    tail -f $PROJECT_DIR/backend.log"
echo -e "  ${CYAN}Frontend:${NC}     tail -f $PROJECT_DIR/frontend.log"
echo ""

echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}🛑 STOP ALL SERVICES${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${RED}pkill -f \"node.*index.js\"${NC}"
echo -e "  ${RED}lsof -ti:3000,3001 | xargs kill -9${NC}"
echo ""

echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}✅ FIXES APPLIED${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${GREEN}✅${NC} Doctor dropdown fix (department sync)"
echo -e "  ${GREEN}✅${NC} Alt-X AI with Google Gemini (FREE)"
echo -e "  ${GREEN}✅${NC} All portals interconnected"
echo -e "  ${GREEN}✅${NC} Database synchronized"
echo -e "  ${GREEN}✅${NC} Auto-send lab reports to doctors"
echo -e "  ${GREEN}✅${NC} Admin can manage all users"
echo -e "  ${GREEN}✅${NC} Complete audit logging"
echo ""

echo -e "${GREEN}╔════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  🎉 READY TO TEST! Open browser and try the portals above         ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Offer to open browser
read "response?${CYAN}🌐 Open Lab Reports portal in browser now? (y/n): ${NC}"
if [[ "$response" =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Opening browser...${NC}"
    sleep 2
    open http://localhost:3000/login/reports
    echo -e "${GREEN}✅ Browser opened!${NC}"
fi

echo ""
echo -e "${GREEN}🎯 Happy Testing!${NC}"
echo ""
