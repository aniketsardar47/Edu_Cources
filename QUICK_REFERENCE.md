# Admin Panel Quick Reference

## 🚀 Start Commands

### Windows (PowerShell/CMD)
```powershell
# Terminal 1 - Backend
cd backend
npm install  # First time only
npm start

# Terminal 2 - Frontend
cd frontend
npm install  # First time only
npm run dev
```

### macOS/Linux
```bash
# Terminal 1 - Backend
cd backend
npm install  # First time only
npm start

# Terminal 2 - Frontend
cd frontend
npm install  # First time only
npm run dev
```

---

## 🌐 Access Points

| What | URL |
|------|-----|
| Admin Login | http://localhost:5173/admin/login |
| Admin Signup | http://localhost:5173/admin/signup |
| Admin Dashboard | http://localhost:5173/admin/dashboard |
| Backend API | http://localhost:7777/api |

---

## 🔑 Test Credentials

After creating an account:
```
Email: your_email@example.com
Password: your_password
```

Or create a new one at signup page.

---

## 📡 API Endpoints

### Signup
```
POST /api/auth/admin/signup
Content-Type: application/json

{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "phone": "+91 9876543210"
}

Response:
{
  "message": "Admin registered successfully",
  "token": "jwt_token",
  "admin": { ... }
}
```

### Login
```
POST /api/auth/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "jwt_token",
  "admin": { ... }
}
```

### Get Profile (Protected)
```
GET /api/auth/admin/profile
Authorization: Bearer jwt_token

Response:
{
  "message": "Profile retrieved successfully",
  "admin": { ... }
}
```

### Logout (Protected)
```
POST /api/auth/admin/logout
Authorization: Bearer jwt_token

Response:
{
  "message": "Logged out successfully"
}
```

---

## 📦 Dependencies Added

### Backend
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens  
- `express` - Framework (already had)
- `cors` - CORS handling (already had)
- `mongoose` - MongoDB (already had)

### Frontend
- `axios` - HTTP client
- `react` - Framework (already had)
- `react-router-dom` - Routing (already had)
- `tailwindcss` - Styling (already had)
- `lucide-react` - Icons (already had)

---

## 🔧 Environment Variables

Create `backend/.env`:
```env
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key_here
PORT=7777
NODE_ENV=development
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `backend/src/models/Admin.js` | Admin schema & model |
| `backend/src/controllers/authAdminController.js` | Auth logic |
| `backend/src/routes/authAdminRoutes.js` | Auth routes |
| `backend/src/middleware/authAdminMiddleware.js` | Token verification |
| `frontend/src/pages/AdminLogin.jsx` | Login UI |
| `frontend/src/pages/AdminSignup.jsx` | Signup UI |
| `frontend/src/pages/AdminDashboard.jsx` | Dashboard UI |
| `frontend/src/services/AdminApi.js` | API client |

---

## ⚠️ Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Module not found | `npm install` in that directory |
| MongoDB connection error | Check DB_URL in .env |
| CORS error | Verify backend is running on port 7777 |
| Token not working | Clear localStorage and login again |
| Port 7777 already in use | Change PORT in .env and restart |
| Port 5173 already in use | Vite will use next available port |

---

## 💡 Testing Flow

1. **Signup Test**
   - Go to `/admin/signup`
   - Fill form and create account
   - Should redirect to `/admin/dashboard`
   - Token should be in localStorage

2. **Login Test**
   - Go to `/admin/login`
   - Use created credentials
   - Should redirect to `/admin/dashboard`
   - Token should be in localStorage

3. **Dashboard Test**
   - View all tabs (Overview, Courses, Videos, Settings)
   - Check permissions displayed
   - Verify logout works

4. **Protected Routes Test**
   - Clear localStorage manually
   - Try to access `/admin/dashboard`
   - Should redirect to `/admin/login`

---

## 📝 Default localStorage Keys

After login, these keys are stored:
```javascript
adminToken      // JWT token string
adminRole       // "admin" or "super_admin"
adminEmail      // Admin's email address
```

Check in DevTools → Application → LocalStorage

---

## 🔒 Security Checklist

- ✅ Passwords are hashed with bcryptjs
- ✅ JWT tokens have 7-day expiration
- ✅ Protected routes require valid token
- ✅ Auto-logout on token expiration
- ✅ Password comparison for login
- ✅ Email validation
- ✅ CORS enabled for frontend
- ✅ No sensitive data in localStorage except token

---

## 📚 Documentation Files

- `ADMIN_SETUP_GUIDE.md` - Detailed setup instructions
- `IMPLEMENTATION_SUMMARY.md` - What was added and why
- `QUICK_REFERENCE.md` - This file

---

## 🆘 Need Help?

1. Check documentation files first
2. Review error messages in browser console
3. Check backend terminal logs
4. Verify all npm packages are installed
5. Ensure both servers are running
6. Clear browser cache and localStorage

---

## ✨ Next Enhancements

- [ ] Course CRUD operations
- [ ] Video management
- [ ] User management
- [ ] Password reset
- [ ] Email notifications
- [ ] Admin activity logs
- [ ] Analytics dashboard

---

**Last Updated**: February 2026

For more details, see: `ADMIN_SETUP_GUIDE.md` & `IMPLEMENTATION_SUMMARY.md`
