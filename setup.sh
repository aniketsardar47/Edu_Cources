#!/bin/bash

# Admin Panel Quick Setup Script
# This script helps you set up the admin panel quickly

echo "====================================="
echo "Admin Panel Setup Script"
echo "====================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js is installed"

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd backend
npm install
echo "✅ Backend dependencies installed"

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  .env file not found in backend directory"
    echo "Please create a .env file with the following variables:"
    echo "  DB_URL=your_mongodb_url"
    echo "  JWT_SECRET=your_jwt_secret_key"
    echo "  PORT=7777"
    echo "  NODE_ENV=development"
fi

cd ..

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd frontend
npm install
echo "✅ Frontend dependencies installed"

cd ..

echo ""
echo "====================================="
echo "✅ Setup Complete!"
echo "====================================="
echo ""
echo "📝 Next Steps:"
echo "1. Update the .env file in the backend directory"
echo "2. Start the backend: cd backend && npm start"
echo "3. Start the frontend: cd frontend && npm run dev"
echo "4. Access admin panel at: http://localhost:5173/admin/login"
echo ""
echo "📚 For detailed setup instructions, see ADMIN_SETUP_GUIDE.md"
echo "====================================="
