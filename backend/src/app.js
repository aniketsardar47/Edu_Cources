const express = require("express");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
const courseRoutes = require("./routes/courseRoutes");
const videoRoutes = require("./routes/videoRoutes");
const authAdminRoutes = require("./routes/authAdminRoutes");
const translateRoute = require("./routes/translateRoute");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cors({
    credentials: true,
    origin: "http://localhost:7777"
}));
app.use(express.json());
app.use(cookieParser());
// Routes
app.use("/api/auth/admin", authAdminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/translate", translateRoute);

module.exports = app;