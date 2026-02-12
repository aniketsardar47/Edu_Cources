const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoute");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", uploadRoutes);

module.exports = app;