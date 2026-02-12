const express = require("express");
const cors = require("cors");
const videoRoutes = require("./routes/videoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admin", videoRoutes);
//sdjhcdhsdh

module.exports = app;