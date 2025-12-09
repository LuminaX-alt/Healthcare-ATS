#!/bin/bash

# 🐳 Docker Quick Start Script for Healthcare Management System

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║   🐳 DOCKER - HEALTHCARE MANAGEMENT SYSTEM                      ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    echo ""
    echo "Install Docker Desktop from:"
    echo "https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo -e "${GREEN}✅ Docker is installed${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running!${NC}"
    echo ""
    echo "Please start Docker Desktop and try again."
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"
echo ""

# Copy environment file if not exists
if [ ! -f .env ]; then
    echo -e "${BLUE}📝 Creating .env file from .env.docker...${NC}"
    cp .env.docker .env
    echo -e "${YELLOW}⚠️  Please edit .env file with your actual API keys${NC}"
    echo ""
fi

echo -e "${BLUE}🐳 Starting Docker containers...${NC}"
echo ""

# Build and start containers
docker-compose up -d --build

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                       ║${NC}"
    echo -e "${GREEN}║   ✅ SUCCESS! Application is running in Docker! 🎉   ║${NC}"
    echo -e "${GREEN}║                                                       ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}🌐 Access your application:${NC}"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:3001/api"
    echo "   MongoDB: localhost:27017"
    echo ""
    echo -e "${GREEN}📊 View logs:${NC}"
    echo "   docker-compose logs -f app"
    echo ""
    echo -e "${GREEN}🛑 Stop containers:${NC}"
    echo "   docker-compose down"
    echo ""
    echo -e "${GREEN}🔄 Restart containers:${NC}"
    echo "   docker-compose restart"
    echo ""
    echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"
    sleep 10
    
    # Open browser
    if command -v open &> /dev/null; then
        open http://localhost:3000
    elif command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:3000
    fi
    
    echo -e "${GREEN}🎯 Application is ready!${NC}"
else
    echo ""
    echo -e "${RED}❌ Failed to start Docker containers${NC}"
    echo ""
    echo -e "${YELLOW}🔧 Troubleshooting:${NC}"
    echo "   1. Check Docker logs: docker-compose logs"
    echo "   2. Check if ports are available: lsof -i :3000 -i :3001 -i :27017"
    echo "   3. Try rebuilding: docker-compose build --no-cache"
    exit 1
fi
