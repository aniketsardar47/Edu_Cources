const jwt = require("jsonwebtoken");

const authAdminMiddleware = (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers.authorization?.split(" ")[1] || req.cookies?.adminToken;

    if (!token) {
      return res.status(401).json({ message: "No token provided. Access denied." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authAdminMiddleware;
