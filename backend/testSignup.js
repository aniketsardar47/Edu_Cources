const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Mock Admin Model
const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, default: "admin" }
});

adminSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Admin = mongoose.model("TestAdmin", adminSchema);

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const email = "test_admin_" + Date.now() + "@example.com";
        const name = "Test Admin";
        const password = "password123";

        const admin = new Admin({ name, email, password });
        await admin.save();
        console.log("Admin saved successfully");

        const found = await Admin.findOne({ email });
        console.log("Found admin:", found.email);

        await Admin.deleteOne({ email });
        console.log("Cleanup done");

        process.exit(0);
    } catch (err) {
        console.error("Test failed:", err);
        process.exit(1);
    }
}

test();
