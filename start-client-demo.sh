#!/bin/bash

# 🚀 QUICK CLIENT DEMO SETUP SCRIPT
# This script starts everything needed for client demo

echo "🎯 LuminaX-alt Client Demo Setup"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 1. Check MongoDB
echo -e "${BLUE}[1/5] Checking MongoDB...${NC}"
if docker ps | grep -q healthcare-mongo; then
    echo -e "${GREEN}✅ MongoDB already running${NC}"
else
    echo -e "${YELLOW}⏳ Starting MongoDB...${NC}"
    docker run -d --name healthcare-mongo -p 27017:27017 mongo:6
    sleep 3
    echo -e "${GREEN}✅ MongoDB started${NC}"
fi
echo ""

# 2. Check Backend
echo -e "${BLUE}[2/5] Checking Backend Server...${NC}"
if lsof -ti:3001 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend already running on port 3001${NC}"
else
    echo -e "${YELLOW}⏳ Starting Backend...${NC}"
    cd server
    npm install >/dev/null 2>&1
    npm run dev > /tmp/backend-demo.log 2>&1 &
    sleep 5
    cd ..
    if lsof -ti:3001 >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend started successfully${NC}"
    else
        echo -e "${RED}❌ Backend failed to start. Check /tmp/backend-demo.log${NC}"
    fi
fi
echo ""

# 3. Check Frontend
echo -e "${BLUE}[3/5] Checking Frontend...${NC}"
if lsof -ti:3000 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend already running on port 3000${NC}"
else
    echo -e "${YELLOW}⏳ Starting Frontend...${NC}"
    npm install >/dev/null 2>&1
    PORT=3000 npm start > /tmp/frontend-demo.log 2>&1 &
    echo -e "${YELLOW}⏳ Waiting for frontend to compile (30 seconds)...${NC}"
    sleep 30
    if lsof -ti:3000 >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend started successfully${NC}"
    else
        echo -e "${RED}❌ Frontend failed to start. Check /tmp/frontend-demo.log${NC}"
    fi
fi
echo ""

# 4. Check if ngrok is installed
echo -e "${BLUE}[4/5] Checking ngrok...${NC}"
if command_exists ngrok; then
    echo -e "${GREEN}✅ ngrok is installed${NC}"
else
    echo -e "${YELLOW}⏳ Installing ngrok...${NC}"
    brew install ngrok
    echo -e "${GREEN}✅ ngrok installed${NC}"
fi
echo ""

# 5. Show options
echo -e "${BLUE}[5/5] Demo Setup Complete!${NC}"
echo ""
echo "=================================="
echo -e "${GREEN}🎉 YOUR SYSTEM IS READY!${NC}"
echo "=================================="
echo ""
echo -e "${YELLOW}📋 DEMO CREDENTIALS:${NC}"
echo "  Patient:    patient@hospital.com / patient123"
echo "  Doctor:     doctor@hospital.com / doctor123"
echo "  Admin:      admin@hospital.com / admin123"
echo "  Pharmacist: pharmacist@hospital.com / pharmacist123"
echo ""
echo -e "${YELLOW}🌐 LOCAL ACCESS:${NC}"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
echo ""
echo -e "${YELLOW}🚀 DEMO OPTIONS:${NC}"
echo ""
echo -e "${BLUE}Option 1: Screen Share Demo (EASIEST)${NC}"
echo "  1. Open http://localhost:3000 in your browser"
echo "  2. Start Zoom/Google Meet"
echo "  3. Share your screen"
echo "  4. Walk through the system"
echo ""
echo -e "${BLUE}Option 2: Give Client Public URL (WITH NGROK)${NC}"
echo "  Run this command to create a public URL:"
echo -e "  ${GREEN}ngrok http 3000${NC}"
echo ""
echo "  Then share the https URL with your client!"
echo ""
echo -e "${BLUE}Option 3: Record Demo Video${NC}"
echo "  1. Open http://localhost:3000"
echo "  2. Use QuickTime or Loom to record"
echo "  3. Share video link with client"
echo ""
echo "=================================="
echo ""
echo -e "${YELLOW}⚡ QUICK NGROK COMMAND:${NC}"
echo -e "  ${GREEN}ngrok http 3000${NC}"
echo ""
echo -e "${YELLOW}📊 VIEW LOGS:${NC}"
echo "  Backend:  tail -f /tmp/backend-demo.log"
echo "  Frontend: tail -f /tmp/frontend-demo.log"
echo ""
echo -e "${GREEN}✅ Ready for client demo!${NC}"
echo ""
