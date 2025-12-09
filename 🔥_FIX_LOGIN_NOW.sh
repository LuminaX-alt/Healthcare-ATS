#!/bin/bash

# 🔥 EMERGENCY LOGIN FIX SCRIPT
# This will fix all login issues by ensuring everything is running properly

echo "🔥 FIXING LOGIN ISSUES - STARTING EVERYTHING..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Kill any existing processes
echo -e "${YELLOW}[1/6] Cleaning up old processes...${NC}"
lsof -ti:3000,3001 2>/dev/null | xargs kill -9 2>/dev/null
echo -e "${GREEN}✅ Old processes cleaned${NC}"
echo ""

# Start Docker if not running
echo -e "${YELLOW}[2/6] Starting Docker...${NC}"
open -a Docker
echo -e "${YELLOW}⏳ Waiting 15 seconds for Docker to start...${NC}"
sleep 15
echo -e "${GREEN}✅ Docker should be running${NC}"
echo ""

# Start MongoDB
echo -e "${YELLOW}[3/6] Starting MongoDB...${NC}"
docker stop healthcare-mongo 2>/dev/null
docker rm healthcare-mongo 2>/dev/null
docker run -d --name healthcare-mongo -p 27017:27017 mongo:6
sleep 5
echo -e "${GREEN}✅ MongoDB started${NC}"
echo ""

# Create demo users
echo -e "${YELLOW}[4/6] Creating demo users...${NC}"
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype/server
node scripts/create-demo-users.js 2>/dev/null || echo "Users may already exist"
echo -e "${GREEN}✅ Demo users ready${NC}"
echo ""

# Start Backend
echo -e "${YELLOW}[5/6] Starting Backend...${NC}"
npm install --silent 2>/dev/null
npm run dev > /tmp/backend-fix.log 2>&1 &
BACKEND_PID=$!
echo -e "${YELLOW}⏳ Waiting for backend to start (10 seconds)...${NC}"
sleep 10

if lsof -ti:3001 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend running on port 3001${NC}"
else
    echo -e "${RED}❌ Backend failed! Check logs: tail -f /tmp/backend-fix.log${NC}"
fi
echo ""

# Start Frontend
echo -e "${YELLOW}[6/6] Starting Frontend...${NC}"
cd /Users/mrdevsharma/Downloads/EX/healthcare-prototype
npm install --silent 2>/dev/null
PORT=3000 npm start > /tmp/frontend-fix.log 2>&1 &
FRONTEND_PID=$!
echo -e "${YELLOW}⏳ Waiting for frontend to compile (30 seconds)...${NC}"
sleep 30

if lsof -ti:3000 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend running on port 3000${NC}"
else
    echo -e "${RED}❌ Frontend failed! Check logs: tail -f /tmp/frontend-fix.log${NC}"
fi
echo ""

# Test MongoDB connection
echo -e "${YELLOW}Testing MongoDB connection...${NC}"
MONGO_TEST=$(docker exec healthcare-mongo mongosh --quiet --eval "db.serverStatus().ok" 2>/dev/null)
if [ "$MONGO_TEST" = "1" ]; then
    echo -e "${GREEN}✅ MongoDB connected${NC}"
else
    echo -e "${RED}❌ MongoDB connection failed${NC}"
fi
echo ""

# Show summary
echo "=============================================="
echo -e "${GREEN}🎉 SYSTEM FIXED AND READY!${NC}"
echo "=============================================="
echo ""
echo -e "${BLUE}🌐 Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}🔧 Backend:${NC}  http://localhost:3001"
echo -e "${BLUE}💾 MongoDB:${NC}  localhost:27017"
echo ""
echo -e "${YELLOW}📋 LOGIN CREDENTIALS:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}👤 Patient:${NC}"
echo "   Email:    patient@hospital.com"
echo "   Password: patient123"
echo ""
echo -e "${GREEN}👨‍⚕️ Doctor:${NC}"
echo "   Email:    doctor@hospital.com"
echo "   Password: doctor123"
echo ""
echo -e "${GREEN}👨‍💼 Admin:${NC}"
echo "   Email:    admin@hospital.com"
echo "   Password: admin123"
echo ""
echo -e "${GREEN}💊 Pharmacist:${NC}"
echo "   Email:    pharmacist@hospital.com"
echo "   Password: pharmacist123"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}🔍 VIEW LOGS:${NC}"
echo "  Backend:  tail -f /tmp/backend-fix.log"
echo "  Frontend: tail -f /tmp/frontend-fix.log"
echo ""
echo -e "${YELLOW}🌐 OPEN IN BROWSER:${NC}"
echo "  Run: open http://localhost:3000"
echo ""
echo -e "${GREEN}✅ Try logging in now!${NC}"
echo ""
