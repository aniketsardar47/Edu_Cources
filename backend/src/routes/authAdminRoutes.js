const express = require("express");
const router = express.Router();
const authAdminController = require("../controllers/authAdminController");
const authAdminMiddleware = require("../middleware/authAdminMiddleware");

// Public routes
router.post("/signup", authAdminController.registerAdmin);
router.post("/login", authAdminController.loginAdmin);

// Protected routes
router.post("/logout", authAdminMiddleware, authAdminController.logoutAdmin);
router.get("/profile", authAdminMiddleware, authAdminController.getAdminProfile);

module.exports = router;
