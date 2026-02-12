const mongoose = require("mongoose");
const app = require("./src/app");
require("dotenv").config();

mongoose.connect("mongodb://localhost:27017/demo")
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(7777, () => {
      console.log(`Server running on port 7777`);
    });
  })
  .catch(err => console.log(err));