#!/bin/bash

# 🚀 Deploy to LuminaX-alt on GitHub
# Quick deployment script for your specific repository

echo "🚀 Deploying to GitHub Repository: LuminaX-alt"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Get GitHub username
echo -e "${BLUE}Enter your GitHub username:${NC}"
read GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo -e "${RED}❌ GitHub username is required!${NC}"
    exit 1
fi

REPO_NAME="LuminaX-alt"
REPO_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo ""
echo -e "${YELLOW}📋 Deployment Configuration:${NC}"
echo "   GitHub Username: $GITHUB_USERNAME"
echo "   Repository Name: $REPO_NAME"
echo "   Repository URL: $REPO_URL"
echo ""

# Check if repository exists on GitHub
echo -e "${YELLOW}⚠️  IMPORTANT: Before continuing, make sure you have:${NC}"
echo "   1. Created the repository 'LuminaX-alt' on GitHub"
echo "   2. Have a Personal Access Token ready"
echo ""
echo -e "${BLUE}Create repository at: ${GREEN}https://github.com/new${NC}"
echo -e "${BLUE}Get token at: ${GREEN}https://github.com/settings/tokens${NC}"
echo ""

echo -e "${YELLOW}Have you created the 'LuminaX-alt' repository on GitHub? (yes/no):${NC}"
read REPO_CREATED

if [ "$REPO_CREATED" != "yes" ]; then
    echo ""
    echo -e "${RED}❌ Please create the repository first!${NC}"
    echo ""
    echo -e "${YELLOW}Steps to create repository:${NC}"
    echo "   1. Go to: https://github.com/new"
    echo "   2. Repository name: LuminaX-alt"
    echo "   3. Description: Healthcare Management System with AI Integration"
    echo "   4. Choose Public or Private"
    echo "   5. ⚠️  DO NOT add README, .gitignore, or license"
    echo "   6. Click 'Create repository'"
    echo ""
    echo "   Then run this script again!"
    exit 0
fi

echo ""
echo -e "${BLUE}🔧 Setting up remote repository...${NC}"

# Remove existing origin if exists
git remote remove origin 2>/dev/null

# Add GitHub remote
git remote add origin "$REPO_URL"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to add remote!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Remote added successfully${NC}"
echo ""

# Ensure we're on main branch
echo -e "${BLUE}🌿 Checking branch...${NC}"
git branch -M main
echo -e "${GREEN}✅ On main branch${NC}"
echo ""

# Show what will be pushed
echo -e "${BLUE}📊 Files to be pushed:${NC}"
FILE_COUNT=$(git ls-files | wc -l)
echo "   Total files: $FILE_COUNT"
echo ""

# Push to GitHub
echo -e "${BLUE}🚀 Pushing to GitHub...${NC}"
echo -e "${YELLOW}⚠️  You'll be prompted for credentials:${NC}"
echo "   Username: $GITHUB_USERNAME"
echo "   Password: Use your Personal Access Token (NOT your GitHub password!)"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                       ║${NC}"
    echo -e "${GREEN}║   ✅ SUCCESS! Your code is live on GitHub! 🎉       ║${NC}"
    echo -e "${GREEN}║                                                       ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}🌐 View your repository at:${NC}"
    echo "   $REPO_URL"
    echo ""
    echo -e "${GREEN}📝 Next Steps:${NC}"
    echo "   1. Visit: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo "   2. Add a description to your repository"
    echo "   3. Add topics/tags: healthcare, ai, react, nodejs, mongodb"
    echo "   4. Update repository visibility if needed"
    echo "   5. Share your repository link!"
    echo ""
    echo -e "${GREEN}🎯 Repository Features:${NC}"
    echo "   ✅ 284+ files deployed"
    echo "   ✅ 81,177+ lines of code"
    echo "   ✅ Healthcare Management System"
    echo "   ✅ Google Gemini AI Integration"
    echo "   ✅ Multi-portal access"
    echo "   ✅ Complete documentation"
    echo ""
else
    echo ""
    echo -e "${RED}╔═══════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                                                       ║${NC}"
    echo -e "${RED}║   ❌ Push Failed - Troubleshooting                   ║${NC}"
    echo -e "${RED}║                                                       ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}🔧 Common Issues:${NC}"
    echo ""
    echo "   1. Repository doesn't exist:"
    echo "      → Create it at: https://github.com/new"
    echo "      → Name must be exactly: LuminaX-alt"
    echo ""
    echo "   2. Authentication failed:"
    echo "      → Use Personal Access Token, not password"
    echo "      → Token must have 'repo' permissions"
    echo "      → Get token at: https://github.com/settings/tokens"
    echo ""
    echo "   3. Repository not empty:"
    echo "      → If you initialized with README, run:"
    echo "      → git pull origin main --allow-unrelated-histories"
    echo "      → git push -u origin main"
    echo ""
    echo "   4. Wrong username:"
    echo "      → Check your GitHub username is correct"
    echo "      → Run script again with correct username"
    echo ""
    exit 1
fi
