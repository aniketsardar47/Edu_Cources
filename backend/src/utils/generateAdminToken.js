const jwt = require("jsonwebtoken");

const generateAdminToken = (adminId, email) => {
  return jwt.sign(
    { id: adminId, email },
    process.env.JWT_SECRET || "your_jwt_secret_key",
    { expiresIn: "7d" }
  );
};

module.exports = generateAdminToken;
