const Admin = require("../models/Admin");
const generateAdminToken = require("../utils/generateAdminToken");

// @desc    Register a new admin
// @route   POST /api/auth/admin/signup
// @access  Public (first admin) or Private (existing admin can create)
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin with this email already exists" });
    }

    // Create new admin
    const admin = new Admin({
      name,
      email,
      password, // Will be hashed by pre-save middleware
      phone,
      role: "admin"
    });

    await admin.save();

    // Generate token
    const token = generateAdminToken(admin._id, admin.email);

    res.status(201).json({
      message: "Admin registered successfully",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup", error: error.message });
  }
};

// @desc    Login admin
// @route   POST /api/auth/admin/login
// @access  Public
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({ message: "Admin account is inactive" });
    }

    // Compare passwords
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateAdminToken(admin._id, admin.email);

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
};

// @desc    Logout admin
// @route   POST /api/auth/admin/logout
// @access  Private
exports.logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("adminToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error during logout" });
  }
};

// @desc    Get current admin profile
// @route   GET /api/auth/admin/profile
// @access  Private
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: "Profile retrieved successfully",
      admin
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
