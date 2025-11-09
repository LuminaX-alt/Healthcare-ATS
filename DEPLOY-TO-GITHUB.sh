#!/bin/bash

# 🚀 GitHub Quick Deploy Script
# This script helps you quickly deploy to GitHub

echo "🚀 GitHub Quick Deploy Script"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if git is initialized
if [ ! -d .git ]; then
    echo -e "${RED}❌ Git not initialized!${NC}"
    echo "Run: git init"
    exit 1
fi

echo -e "${GREEN}✅ Git repository found${NC}"
echo ""

# Get GitHub username
echo -e "${BLUE}Enter your GitHub username:${NC}"
read GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo -e "${RED}❌ GitHub username is required!${NC}"
    exit 1
fi

# Get repository name
echo -e "${BLUE}Enter repository name (press Enter for 'healthcare-management-system'):${NC}"
read REPO_NAME

if [ -z "$REPO_NAME" ]; then
    REPO_NAME="healthcare-management-system"
fi

echo ""
echo -e "${YELLOW}📋 Configuration:${NC}"
echo "   GitHub Username: $GITHUB_USERNAME"
echo "   Repository Name: $REPO_NAME"
echo "   Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""

# Confirm
echo -e "${YELLOW}Do you want to continue? (yes/no):${NC}"
read CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${RED}❌ Deployment cancelled${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}🔧 Setting up remote...${NC}"

# Remove existing origin if exists
git remote remove origin 2>/dev/null

# Add new origin
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo -e "${GREEN}✅ Remote added${NC}"
echo ""

# Ensure we're on main branch
echo -e "${BLUE}🌿 Checking branch...${NC}"
git branch -M main
echo -e "${GREEN}✅ On main branch${NC}"
echo ""

# Show status
echo -e "${BLUE}📊 Git Status:${NC}"
git status
echo ""

# Push to GitHub
echo -e "${BLUE}🚀 Pushing to GitHub...${NC}"
echo -e "${YELLOW}⚠️  You'll be prompted for your GitHub credentials${NC}"
echo -e "${YELLOW}⚠️  Use Personal Access Token as password, not your GitHub password${NC}"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ SUCCESS! Your code is on GitHub!${NC}"
    echo ""
    echo -e "${GREEN}🌐 View your repository at:${NC}"
    echo "   https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo ""
    echo -e "${GREEN}📝 Next Steps:${NC}"
    echo "   1. Go to GitHub and verify all files are there"
    echo "   2. Add a description to your repository"
    echo "   3. Add topics/tags for discoverability"
    echo "   4. Share your repository link!"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Push failed!${NC}"
    echo ""
    echo -e "${YELLOW}🔧 Troubleshooting:${NC}"
    echo "   1. Make sure you created the repository on GitHub first"
    echo "   2. Check your GitHub username and repository name"
    echo "   3. Use Personal Access Token, not password"
    echo "   4. Repository must exist at: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo ""
    echo -e "${YELLOW}📖 Need help? Check GITHUB_DEPLOYMENT_GUIDE.md${NC}"
    echo ""
    exit 1
fi
