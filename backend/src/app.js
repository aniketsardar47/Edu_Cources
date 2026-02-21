const express = require("express");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
const courseRoutes = require("./routes/courseRoutes");
const videoRoutes = require("./routes/videoRoutes");
const authAdminRoutes = require("./routes/authAdminRoutes");
const translateRoute = require("./routes/translateRoute");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth/admin", authAdminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/videos", videoRoutes);

app.use("/api/translate", translateRoute);

module.exports = app;