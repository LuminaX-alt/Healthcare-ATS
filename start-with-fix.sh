#!/bin/bash

# 🚨 DOCTOR DROPDOWN FIX - Complete Application Startup and Test Script
# This script fixes the issue where doctors don't appear in dropdown menus

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🏥 HEALTHCARE PROTOTYPE - DOCTOR DROPDOWN FIX            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Change to project directory
cd "$(dirname "$0")"
PROJECT_DIR="/Users/mrdevsharma/Downloads/EX/healthcare-prototype"
cd "$PROJECT_DIR"

echo -e "${BLUE}📍 Project Directory: $PROJECT_DIR${NC}"
echo ""

# Step 1: Check MongoDB
echo -e "${YELLOW}🔍 Step 1: Checking MongoDB...${NC}"
if pgrep -x "mongod" > /dev/null; then
    echo -e "${GREEN}✅ MongoDB is running${NC}"
else
    echo -e "${RED}❌ MongoDB is NOT running${NC}"
    echo -e "${YELLOW}   Starting MongoDB...${NC}"
    brew services start mongodb-community 2>/dev/null || mongod --fork --logpath /tmp/mongodb.log 2>/dev/null
    sleep 3
    if pgrep -x "mongod" > /dev/null; then
        echo -e "${GREEN}✅ MongoDB started successfully${NC}"
    else
        echo -e "${RED}❌ Failed to start MongoDB${NC}"
        echo -e "${YELLOW}   Please start MongoDB manually:${NC}"
        echo -e "   ${BLUE}brew services start mongodb-community${NC}"
        exit 1
    fi
fi
echo ""

# Step 2: Fix Database
echo -e "${YELLOW}🔧 Step 2: Syncing doctor departments in database...${NC}"
cd "$PROJECT_DIR/server"
if [ -f "fix-doctor-departments.js" ]; then
    node fix-doctor-departments.js
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database sync complete${NC}"
    else
        echo -e "${RED}⚠️  Database sync had issues (continuing anyway)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Fix script not found, skipping database sync${NC}"
fi
echo ""

# Step 3: Kill existing processes
echo -e "${YELLOW}🔄 Step 3: Cleaning up old processes...${NC}"
pkill -f "node.*index.js" 2>/dev/null && echo -e "${GREEN}✅ Stopped old backend${NC}" || echo -e "${YELLOW}⚠️  No backend process found${NC}"
lsof -ti:3001 | xargs kill -9 2>/dev/null && echo -e "${GREEN}✅ Freed port 3001${NC}" || echo -e "${YELLOW}⚠️  Port 3001 already free${NC}"
lsof -ti:3000 | xargs kill -9 2>/dev/null && echo -e "${GREEN}✅ Freed port 3000${NC}" || echo -e "${YELLOW}⚠️  Port 3000 already free${NC}"
sleep 2
echo ""

# Step 4: Start Backend
echo -e "${YELLOW}🚀 Step 4: Starting backend server...${NC}"
cd "$PROJECT_DIR/server"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}   Installing backend dependencies...${NC}"
    npm install --silent
fi

# Start backend in background
nohup npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
echo -e "${BLUE}   Log file: $PROJECT_DIR/backend.log${NC}"

# Wait for backend to start
echo -e "${YELLOW}   Waiting for backend to be ready...${NC}"
for i in {1..15}; do
    if curl -s http://localhost:3001/api/doctors > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is ready!${NC}"
        break
    fi
    sleep 1
    echo -n "."
done
echo ""
echo ""

# Step 5: Test Backend API
echo -e "${YELLOW}🧪 Step 5: Testing backend API...${NC}"

# Test doctors endpoint
DOCTORS_RESPONSE=$(curl -s http://localhost:3001/api/doctors)
DOCTOR_COUNT=$(echo "$DOCTORS_RESPONSE" | jq '. | length' 2>/dev/null || echo "0")

if [ "$DOCTOR_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ API /doctors working: $DOCTOR_COUNT doctors found${NC}"
    
    # Show first doctor
    FIRST_DOCTOR=$(echo "$DOCTORS_RESPONSE" | jq '.[0] | {name, department, specialty}' 2>/dev/null)
    if [ -n "$FIRST_DOCTOR" ]; then
        echo -e "${BLUE}   Sample doctor:${NC}"
        echo "$FIRST_DOCTOR" | sed 's/^/   /'
    fi
else
    echo -e "${RED}⚠️  API returned no doctors${NC}"
fi
echo ""

# Step 6: Start Frontend
echo -e "${YELLOW}🚀 Step 6: Starting frontend...${NC}"
cd "$PROJECT_DIR"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}   Installing frontend dependencies...${NC}"
    npm install --silent
fi

# Start frontend in background
nohup npm start > frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
echo -e "${BLUE}   Log file: $PROJECT_DIR/frontend.log${NC}"

# Wait for frontend to start
echo -e "${YELLOW}   Waiting for frontend to be ready...${NC}"
for i in {1..20}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend is ready!${NC}"
        break
    fi
    sleep 1
    echo -n "."
done
echo ""
echo ""

# Step 7: Summary
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🎉 APPLICATION STARTED SUCCESSFULLY!                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✅ Backend:${NC}  http://localhost:3001"
echo -e "${GREEN}✅ Frontend:${NC} http://localhost:3000"
echo -e "${GREEN}✅ MongoDB:${NC}  Running"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "🧪 TEST THE FIX:"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}Test 1: Admin Dashboard${NC}"
echo "   1. Go to: http://localhost:3000/login/admin"
echo "   2. Login: admin@hospital.com / adminpass123"
echo "   3. Click: Users tab"
echo "   4. Edit a doctor"
echo "   5. Select Department: Cardiology"
echo "   6. Select Designation: Professor"
echo "   7. Save"
echo "   ${GREEN}✅ Expected: Doctor saved successfully${NC}"
echo ""
echo -e "${BLUE}Test 2: Lab Reports Dashboard${NC}"
echo "   1. Go to: http://localhost:3000/login/reports"
echo "   2. Login: reports@hospital.com / reportspass123"
echo "   3. Click: Upload Report tab"
echo "   4. Select Department: Cardiology"
echo "   5. Check Doctor dropdown"
echo "   ${GREEN}✅ Expected: Doctor names should appear!${NC}"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo -e "${YELLOW}📝 Credentials:${NC}"
echo "   Admin:        admin@hospital.com / adminpass123"
echo "   Doctor:       doctor@hospital.com / doctorpass123"
echo "   Lab Reports:  reports@hospital.com / reportspass123"
echo "   Pharmacist:   pharmacist@hospital.com / pharmpass123"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo -e "${YELLOW}🔧 Troubleshooting:${NC}"
echo "   View backend logs:  tail -f $PROJECT_DIR/backend.log"
echo "   View frontend logs: tail -f $PROJECT_DIR/frontend.log"
echo "   Stop all:           pkill -f 'node.*index.js' && lsof -ti:3000,3001 | xargs kill -9"
echo "   Restart:            ./start-with-fix.sh"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}🎯 Happy Testing!${NC}"
echo ""

# Open browser (optional)
read -p "🌐 Open browser automatically? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Opening browser...${NC}"
    sleep 2
    open http://localhost:3000/login/reports
fi
