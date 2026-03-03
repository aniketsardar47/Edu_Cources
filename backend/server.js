const mongoose = require("mongoose");
const app = require("./src/app");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected");

  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });

})
.catch((err) => {
  console.error("MongoDB connection failed:", err);
});