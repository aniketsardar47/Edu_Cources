const express = require("express");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
const courseRoutes = require("./routes/courseRoutes");
const videoRoutes = require("./routes/videoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
// app.use("/api/admin", videoRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);



app.use("/api/videos", videoRoutes);


//sdjhcdhsdh

module.exports = app;