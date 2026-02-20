# Admin Panel Setup & Usage Guide

## Overview
This guide helps you set up and use the new Admin Panel authentication system for your Edu_Courses project. The admin panel includes login, signup, and a comprehensive dashboard for managing courses and videos.

## Features Added

### Backend
- **Admin Model** (`src/models/Admin.js`)
  - Email, password, phone, role, permissions, and account status
  - Password hashing with bcryptjs
  - Method for password comparison

- **Authentication Controller** (`src/controllers/authAdminController.js`)
  - Admin registration (signup)
  - Admin login
  - Admin logout
  - Get admin profile

- **Authentication Routes** (`src/routes/authAdminRoutes.js`)
  - POST `/api/auth/admin/signup` - Register new admin
  - POST `/api/auth/admin/login` - Login admin
  - POST `/api/auth/admin/logout` - Logout admin  
  - GET `/api/auth/admin/profile` - Get admin profile

- **Auth Middleware** (`src/middleware/authAdminMiddleware.js`)
  - JWT token verification
  - Protects admin routes

- **JWT Utilities** (`src/utils/generateAdminToken.js`)
  - Generates JWT tokens for admin sessions

### Frontend
- **Admin Login Page** (`src/pages/AdminLogin.jsx`)
  - Email and password login form
  - Form validation
  - Error messages

- **Admin Signup Page** (`src/pages/AdminSignup.jsx`)
  - Registration form with name, email, phone
  - Password confirmation
  - Terms & conditions checkbox

- **Admin Dashboard** (`src/pages/AdminDashboard.jsx`)
  - Profile overview
  - Statistics cards (courses, videos, account status)
  - Permission management view
  - Course management section
  - Video management section
  - Settings & profile management
  - Password change functionality
  - Logout functionality

- **API Service** (`src/services/AdminApi.js`)
  - Axios instance with JWT token handling
  - Auto-redirect on unauthorized (401) errors

## Setup Instructions

### 1. Backend Setup

#### Step 1: Install Dependencies
```bash
cd backend
npm install
```

The new packages added are:
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation

#### Step 2: Update Environment Variables
Create or update your `.env` file in the backend root:
```env
DB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret_key
PORT=7777
NODE_ENV=development
```

#### Step 3: MongoDB Connection
Ensure MongoDB is running and the connection string is correct in your `.env` file.

#### Step 4: Start Backend Server
```bash
npm start
# or with nodemon for development
nodemon server.js
```

The server should start on `http://localhost:7777`

### 2. Frontend Setup

#### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

New package added:
- `axios` - HTTP client for API requests

#### Step 2: Start Development Server
```bash
npm run dev
```

The frontend will typically start on `http://localhost:5173`

## API Endpoints

### Admin Authentication Endpoints

#### 1. Register Admin
**POST** `/api/auth/admin/signup`

Request body:
```json
{
  "name": "John Admin",
  "email": "admin@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123",
  "phone": "+91 9876543210"
}
```

Response:
```json
{
  "message": "Admin registered successfully",
  "token": "jwt_token_here",
  "admin": {
    "id": "admin_id",
    "name": "John Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### 2. Login Admin
**POST** `/api/auth/admin/login`

Request body:
```json
{
  "email": "admin@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "admin": {
    "id": "admin_id",
    "name": "John Admin",
    "email": "admin@example.com",
    "role": "admin",
    "permissions": {
      "canManageCourses": true,
      "canManageVideos": true,
      "canManageAdmins": false
    }
  }
}
```

#### 3. Get Admin Profile
**GET** `/api/auth/admin/profile`

Headers:
```
Authorization: Bearer jwt_token_here
```

#### 4. Logout Admin
**POST** `/api/auth/admin/logout`

Headers:
```
Authorization: Bearer jwt_token_here
```

## Testing the Admin Panel

### Access Points
- **Admin Login**: `http://localhost:5173/admin/login`
- **Admin Signup**: `http://localhost:5173/admin/signup`
- **Admin Dashboard**: `http://localhost:5173/admin/dashboard`

### Demo Credentials (for reference)
```
Email: admin@example.com
Password: admin123
```

### Testing Steps
1. Navigate to `http://localhost:5173/admin/signup`
2. Create a new admin account
3. You'll be automatically logged in and redirected to the dashboard
4. Or navigate to `/admin/login` to test login functionality
5. View your profile and permissions in the dashboard
6. Explore different tabs: Overview, Courses, Videos, Settings

## File Structure

```
backend/
├── src/
│   ├── models/
│   │   ├── Admin.js (NEW)
│   │   ├── Course.js
│   │   └── Video.js
│   ├── controllers/
│   │   ├── authAdminController.js (NEW)
│   │   ├── adminController.js (existing)
│   │   ├── courseController.js
│   │   └── videoController.js
│   ├── routes/
│   │   ├── authAdminRoutes.js (NEW)
│   │   ├── adminRoutes.js (existing)
│   │   ├── courseRoutes.js
│   │   └── videoRoutes.js
│   ├── middleware/
│   │   └── authAdminMiddleware.js (NEW)
│   ├── utils/
│   │   └── generateAdminToken.js (NEW)
│   └── app.js (UPDATED)
├── package.json (UPDATED)
└── server.js

frontend/
├── src/
│   ├── pages/
│   │   ├── AdminLogin.jsx (NEW)
│   │   ├── AdminSignup.jsx (NEW)
│   │   ├── AdminDashboard.jsx (NEW)
│   │   ├── HomePage.jsx
│   │   ├── CoursePage.jsx
│   │   └── VideoPlayerPage.jsx
│   ├── services/
│   │   ├── AdminApi.js (NEW)
│   │   └── Api.js (existing)
│   └── App.jsx (UPDATED)
├── package.json (UPDATED)
└── index.html
```

## Key Security Features

1. **Password Hashing**: All passwords are hashed using bcryptjs before storage
2. **JWT Tokens**: Stateless authentication using JWT
3. **Token Expiration**: Tokens expire in 7 days
4. **Authorization Header**: Token sent via Authorization Bearer header
5. **Protected Routes**: Admin routes require valid JWT token
6. **Auto Logout on 401**: Automatic redirect to login on unauthorized access

## Next Steps & Enhancements

1. **Add Course Management**
   - List all courses
   - Create new course
   - Edit course
   - Delete course

2. **Add Video Management**
   - List videos by course
   - Upload new video
   - Edit video details
   - Delete video

3. **Add User Management**
   - Create additional admin accounts
   - Manage user roles and permissions
   - View user activity

4. **Email Notifications**
   - Welcome email on registration
   - Password reset via email
   - Admin activity notifications

5. **Enhanced Dashboard**
   - Charts and analytics
   - Recent activity logs
   - System health status

## Troubleshooting

### Issue: "Token not found" Error
- Ensure token is being stored in localStorage after login
- Check browser's LocalStorage in DevTools

### Issue: CORS Error
- Verify backend is allowing your frontend origin
- Check that both servers are running on correct ports

### Issue: Database Connection Error
- Verify MongoDB is running
- Check DB_URL in .env file
- Ensure network connectivity to MongoDB

### Issue: Password Hashing Not Working
- Ensure bcryptjs is installed: `npm install bcryptjs`
- Check that Admin model has the pre-save hook

### Issue: JWT Verification Failing
- Verify JWT_SECRET is set in .env
- Check token expiration time
- Ensure Bearer token format is correct: `Authorization: Bearer <token>`

## Password Reset Feature (Future)

When implementing password reset:
1. Create password reset route: `POST /api/auth/admin/forgot-password`
2. Send reset token via email
3. Create reset page with new password form
4. Validate reset token and update password

## Environment Variables Required

```env
# Backend
DB_URL=mongodb+srv://user:password@cluster.mongodb.net/database
JWT_SECRET=your_secret_key_here
PORT=7777
NODE_ENV=development

# Frontend
VITE_API_BASE_URL=http://localhost:7777/api
```

## Support & Documentation

For the reference implementation, check: https://github.com/PrashantSontakke10/edu_classes

This admin panel integrates seamlessly with your existing course and video management system while adding powerful admin authentication capabilities.
