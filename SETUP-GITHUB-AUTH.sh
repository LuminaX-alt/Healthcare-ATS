#!/bin/bash

# 🔐 GitHub Authentication Setup for LuminaX-alt

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║   🔐 GITHUB AUTHENTICATION SETUP                                ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Authentication failed because GitHub requires a Personal Access Token.${NC}"
echo ""
echo -e "${BLUE}You have 2 options:${NC}"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}OPTION 1: Use Personal Access Token (Recommended)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Get your Personal Access Token:"
echo "   → Open: https://github.com/settings/tokens"
echo "   → Click: 'Generate new token (classic)'"
echo "   → Name: Hospital Portal Project"
echo "   → Select: ✅ repo (all permissions)"
echo "   → Click: Generate token"
echo "   → COPY IT IMMEDIATELY!"
echo ""
echo "2. Enter your token below:"
echo ""
read -sp "   Paste your Personal Access Token: " TOKEN
echo ""

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ No token provided!${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🔧 Configuring Git credential helper...${NC}"

# Configure credential helper
git config --global credential.helper store

# Set up the credential with token
echo "https://LuminaX-alt:$TOKEN@github.com" > ~/.git-credentials

echo -e "${GREEN}✅ Credentials configured!${NC}"
echo ""
echo -e "${BLUE}🚀 Now pushing to GitHub...${NC}"
echo ""

# Push to GitHub
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                       ║${NC}"
    echo -e "${GREEN}║   ✅ SUCCESS! Code deployed to GitHub! 🎉           ║${NC}"
    echo -e "${GREEN}║                                                       ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}🌐 View your repository at:${NC}"
    echo "   https://github.com/LuminaX-alt/Hospital-Portal-For-ATS-AI-Enabled"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Push failed! Check the error above.${NC}"
    echo ""
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo "   1. Make sure repository exists on GitHub"
    echo "   2. Verify your token has 'repo' permissions"
    echo "   3. Try generating a new token"
    exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}OPTION 2: Manual Push with Token${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "If the automated method didn't work, run:"
echo ""
echo "   git push -u origin main"
echo ""
echo "When prompted:"
echo "   Username: LuminaX-alt"
echo "   Password: [PASTE YOUR TOKEN]"
echo ""
