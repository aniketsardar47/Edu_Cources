@echo off
REM Admin Panel Quick Setup Script for Windows
REM This script helps you set up the admin panel quickly

cls
echo =====================================
echo Admin Panel Setup Script
echo =====================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo X Node.js is not installed. Please install Node.js first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo + Node.js is installed
echo.

REM Setup Backend
echo Installing Backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo X Failed to install backend dependencies
    pause
    exit /b 1
)
echo + Backend dependencies installed
cd ..

REM Check if .env exists
if not exist "backend\.env" (
    echo.
    echo ! .env file not found in backend directory
    echo Please create a .env file with the following variables:
    echo   DB_URL=your_mongodb_url
    echo   JWT_SECRET=your_jwt_secret_key
    echo   PORT=7777
    echo   NODE_ENV=development
    echo.
)

REM Setup Frontend
echo.
echo Installing Frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo X Failed to install frontend dependencies
    pause
    exit /b 1
)
echo + Frontend dependencies installed
cd ..

cls
echo =====================================
echo + Setup Complete!
echo =====================================
echo.
echo Next Steps:
echo 1. Update the .env file in the backend directory
echo 2. Start the backend: cd backend ^& npm start
echo 3. Start the frontend: cd frontend ^& npm run dev
echo 4. Access admin panel at: http://localhost:5173/admin/login
echo.
echo For detailed setup instructions, see ADMIN_SETUP_GUIDE.md
echo =====================================
echo.
pause
