#!/bin/bash

# StormBrainer Galaxy Edition - Quick Start Script
# This script helps you set up and run the application quickly

set -e

echo "🌌 StormBrainer Galaxy Edition - Quick Start"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL not found in PATH. Make sure it's installed.${NC}"
fi

# Function to generate JWT secret
generate_jwt_secret() {
    node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
}

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd backend

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    JWT_SECRET=$(generate_jwt_secret)
    cat > .env << EOF
PORT=3001
NODE_ENV=development
DB_USER=postgres
DB_HOST=localhost
DB_NAME=stormbrainer
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=$JWT_SECRET
CORS_ORIGIN=http://localhost:3000
EOF
    echo -e "${GREEN}✅ Created .env file${NC}"
    echo -e "${YELLOW}⚠️  Please edit backend/.env and update DB_PASSWORD${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Backend dependencies already installed${NC}"
fi

# Setup Database
echo ""
echo "🗄️  Setting up Database..."
echo -e "${YELLOW}Make sure PostgreSQL is running and you've created the 'stormbrainer' database${NC}"
echo ""
read -p "Have you created the database? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running database schema..."
    read -p "Enter PostgreSQL username (default: postgres): " db_user
    db_user=${db_user:-postgres}
    
    if psql -U "$db_user" -d stormbrainer -f database/schema.sql; then
        echo -e "${GREEN}✅ Database schema created successfully${NC}"
    else
        echo -e "${RED}❌ Failed to create database schema${NC}"
        echo "You can run it manually: psql -U $db_user -d stormbrainer -f database/schema.sql"
    fi
else
    echo -e "${YELLOW}⚠️  Please create database manually:${NC}"
    echo "  1. psql -U postgres"
    echo "  2. CREATE DATABASE stormbrainer;"
    echo "  3. \\q"
    echo "  4. psql -U postgres -d stormbrainer -f backend/database/schema.sql"
fi

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd ../frontend

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating frontend .env file...${NC}"
    echo "REACT_APP_API_URL=http://localhost:3001/api" > .env
    echo -e "${GREEN}✅ Created frontend .env file${NC}"
else
    echo -e "${GREEN}✅ Frontend .env file already exists${NC}"
fi

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Frontend dependencies already installed${NC}"
fi

# Go back to root
cd ..

echo ""
echo "=============================================="
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "To start the application:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd backend"
echo "    npm run dev"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd frontend"
echo "    npm start"
echo ""
echo "Or use Docker:"
echo "  docker-compose up"
echo ""
echo "The app will be available at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
echo ""
echo -e "${YELLOW}⚠️  Remember to update backend/.env with your database password!${NC}"
echo ""