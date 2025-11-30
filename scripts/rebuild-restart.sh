#!/bin/bash

# Rebuild and Restart Script
# This script pulls latest changes, rebuilds the project, and restarts the pm2 server
#
# USAGE: Run from within the project directory
#        cd /var/www/landing
#        ./scripts/rebuild-restart.sh

set -e  # Exit on any error

echo "🔄 Starting rebuild and restart process..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 0: Check GitHub CLI authentication
echo -e "${BLUE}Step 0: Checking GitHub CLI status...${NC}"
if ! command -v gh &> /dev/null; then
  echo -e "${YELLOW}⚠️  GitHub CLI is not installed. Using standard git commands.${NC}"
  USE_GH=false
else
  if gh auth status &> /dev/null; then
    echo "✓ GitHub CLI is authenticated"
    USE_GH=true

    # Show repository status
    echo ""
    echo -e "${BLUE}Repository status:${NC}"
    gh repo view --json nameWithOwner,description,defaultBranchRef --jq '"Repository: \(.nameWithOwner)\nDefault branch: \(.defaultBranchRef.name)\nDescription: \(.description)"'
    echo ""
  else
    echo -e "${YELLOW}⚠️  GitHub CLI is not authenticated. Using standard git commands.${NC}"
    echo "Run 'gh auth login' to authenticate for enhanced features."
    USE_GH=false
  fi
fi
echo ""

# Step 1: Pull latest changes
echo -e "${BLUE}Step 1: Pulling latest changes from upstream...${NC}"

if [ "$USE_GH" = true ]; then
  # Show recent commits before pulling
  echo "Recent commits on remote:"
  gh api repos/RevelryPlay/the-next-ideal/commits?per_page=3 --jq '.[] | "  • \(.commit.message | split("\n")[0]) (\(.commit.author.name))"'
  echo ""
fi

git fetch origin
git pull origin main
echo -e "${GREEN}✓ Latest changes pulled${NC}"
echo ""

# Step 2: Install/update dependencies
echo -e "${BLUE}Step 2: Installing/updating dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies updated${NC}"
echo ""

# Step 3: Build project
echo -e "${BLUE}Step 3: Building project...${NC}"
npm run build
echo -e "${GREEN}✓ Project built${NC}"
echo ""

# Step 4: Restart pm2 server
echo -e "${BLUE}Step 4: Restarting pm2 server...${NC}"
pm2 restart landing
echo -e "${GREEN}✓ Server restarted${NC}"
echo ""

# Show server status
echo -e "${BLUE}Current server status:${NC}"
pm2 status landing
echo ""

echo -e "${GREEN}🎉 Rebuild and restart complete!${NC}"
echo ""

# Show deployment info if GitHub CLI is available
if [ "$USE_GH" = true ]; then
  echo -e "${BLUE}Current deployment:${NC}"
  echo "  Branch: $(git branch --show-current)"
  echo "  Commit: $(git log -1 --format='%h - %s')"
  echo ""
fi

echo "Useful commands:"
echo "  pm2 logs landing - View server logs"
echo "  pm2 monit       - Monitor CPU/memory usage"
if [ "$USE_GH" = true ]; then
  echo "  gh pr list      - View open pull requests"
  echo "  gh release list - View releases"
  echo "  gh run list     - View workflow runs"
fi
