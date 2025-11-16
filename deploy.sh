#!/bin/bash

# Server Deployment Script for Liquor Inventory Backend
# This script fixes the IPv6 connection issue and deploys with PM2

set -e  # Exit on any error

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Build the application
echo -e "${YELLOW}📦 Building application...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Step 2: Create logs directory
echo -e "${YELLOW}📁 Creating logs directory...${NC}"
mkdir -p logs

# Step 3: Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${RED}❌ PM2 is not installed${NC}"
    echo "Install PM2 with: npm install -g pm2"
    exit 1
fi

# Step 4: Stop and delete existing PM2 process
echo -e "${YELLOW}🛑 Stopping existing PM2 process...${NC}"
pm2 stop nest-api 2>/dev/null || true
pm2 delete nest-api 2>/dev/null || true

# Step 5: Start with ecosystem file
echo -e "${YELLOW}🚀 Starting application with PM2...${NC}"
pm2 start ecosystem.config.js

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Application started successfully${NC}"
else
    echo -e "${RED}❌ Failed to start application${NC}"
    exit 1
fi

# Step 6: Save PM2 configuration
echo -e "${YELLOW}💾 Saving PM2 configuration...${NC}"
pm2 save

# Step 7: Show status
echo -e "${YELLOW}📊 Current PM2 status:${NC}"
pm2 list

# Step 8: Show logs
echo -e "${YELLOW}📝 Showing recent logs...${NC}"
pm2 logs nest-api --lines 20 --nostream

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Commands for monitoring:"
echo "  pm2 logs nest-api      - View logs"
echo "  pm2 restart nest-api   - Restart application"
echo "  pm2 stop nest-api      - Stop application"
echo "  pm2 list               - Show all processes"
