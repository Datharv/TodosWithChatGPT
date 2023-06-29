const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

router.use(cookieParser());



router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

    // Set the token as a cookie
    res.cookie("token", token, { httpOnly: true });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Failed to register user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// login user
// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate a JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    // Set the token as a cookie
    res.cookie("token", token, { httpOnly: true });

    res.json({ message: "User logged in successfully" });
  } catch (error) {
    console.error("Failed to log in user:", error);
    res.status(500).json({ error: "Failed to log in user" });
  }
});

// logout 
// Logout user
router.get("/logout", async (req, res) => {
  // Clear the token cookie
  res.clearCookie("token");
  res.json({ message: "User logged out successfully" });
});




module.exports = router;
