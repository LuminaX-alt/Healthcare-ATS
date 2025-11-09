#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  LuminaX-alt Healthcare Application  ${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if MongoDB is running
echo -e "${YELLOW}[1/3] Checking MongoDB...${NC}"
if pgrep -x "mongod" > /dev/null; then
    echo -e "${GREEN}✓ MongoDB is running${NC}\n"
else
    echo -e "${RED}✗ MongoDB is not running${NC}"
    echo -e "${YELLOW}Starting MongoDB...${NC}"
    brew services start mongodb-community > /dev/null 2>&1 || mongod --fork --logpath /usr/local/var/log/mongodb/mongo.log > /dev/null 2>&1
    sleep 3
    if pgrep -x "mongod" > /dev/null; then
        echo -e "${GREEN}✓ MongoDB started successfully${NC}\n"
    else
        echo -e "${RED}✗ Could not start MongoDB. Please start it manually:${NC}"
        echo -e "${YELLOW}  brew services start mongodb-community${NC}"
        echo -e "${YELLOW}  OR${NC}"
        echo -e "${YELLOW}  mongod --dbpath /usr/local/var/mongodb${NC}\n"
    fi
fi

# Start Backend Server
echo -e "${YELLOW}[2/3] Starting Backend Server (Port 3001)...${NC}"
cd server
npm start &
BACKEND_PID=$!
sleep 3
echo -e "${GREEN}✓ Backend server starting...${NC}\n"

# Start Frontend App
echo -e "${YELLOW}[3/3] Starting Frontend App (Port 3000)...${NC}"
cd ..
npm start &
FRONTEND_PID=$!
sleep 3
echo -e "${GREEN}✓ Frontend app starting...${NC}\n"

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ APPLICATION STARTED SUCCESSFULLY!${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "${GREEN}Frontend:${NC} http://localhost:3000"
echo -e "${GREEN}Backend:${NC}  http://localhost:3001\n"

echo -e "${YELLOW}Test Credentials:${NC}"
echo -e "  ${BLUE}Admin:${NC}    admin@hospital.com / admin123"
echo -e "  ${BLUE}Patient:${NC}  +1234567890 / OTP: 123456"
echo -e "  ${BLUE}Doctor:${NC}   doctor@hospital.com / doctor123\n"

echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}\n"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
