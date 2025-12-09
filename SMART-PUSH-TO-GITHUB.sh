#!/bin/bash

# 🔐 Smart GitHub Push with Token Expiration Handling

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║   🚀 SMART GITHUB PUSH - WITH TOKEN CHECK                       ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Try to push
echo -e "${YELLOW}Attempting to push to GitHub...${NC}"
echo ""

git push -u origin main 2>&1 | tee /tmp/git_push_output.txt

# Check if push was successful
if [ ${PIPESTATUS[0]} -eq 0 ]; then
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
    # Check what kind of error occurred
    if grep -q "Invalid username or token" /tmp/git_push_output.txt || \
       grep -q "Authentication failed" /tmp/git_push_output.txt || \
       grep -q "403" /tmp/git_push_output.txt || \
       grep -q "401" /tmp/git_push_output.txt; then
        
        echo ""
        echo -e "${RED}╔═══════════════════════════════════════════════════════╗${NC}"
        echo -e "${RED}║                                                       ║${NC}"
        echo -e "${RED}║   ⚠️  TOKEN EXPIRED OR INVALID                       ║${NC}"
        echo -e "${RED}║                                                       ║${NC}"
        echo -e "${RED}╚═══════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${YELLOW}🔑 YOUR TOKEN HAS EXPIRED OR IS INVALID${NC}"
        echo ""
        echo "Please generate a NEW Personal Access Token:"
        echo ""
        echo "1. Go to: https://github.com/settings/tokens"