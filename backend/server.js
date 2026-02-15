const mongoose = require("mongoose");
const app = require("./src/app");
require("dotenv").config();

mongoose.connect("mongodb+srv://prashantsontakke386_db_user:4YnuBSB3Zd8EJpFZ@cluster0.w4vf9t4.mongodb.net/demo")
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(7777, () => {
      console.log(`Server running on port 7777`);
    });
  })
  .catch(err => console.log(err));