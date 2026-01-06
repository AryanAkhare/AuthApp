const bcrypt = require("bcrypt");           // For hashing passwords
const User = require("../model/user");      // User model
const user = require("../model/user");
const jwt=require("jsonwebtoken");
require("dotenv").config()
// Signup controller
exports.signup = async (req, res) => {
  try {
    // Extract user details from request body
    const { name, email, password, role } = req.body;
    
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password before saving
    const hashPass = await bcrypt.hash(password, 10);

    // Create new user in database
    await User.create({
      name,
      email,
      password: hashPass,
      role,
    });

    // Success response
    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });

  } catch (err) {
    // Handle unexpected errors
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "User can't be registered",
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success:false, message:"All fields required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success:false, message:"User not found" });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ success:false, message:"Wrong password" });
    }

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

    const userObj = user.toObject();
    userObj.password = undefined;

    res.cookie("token", token, {
      expires: new Date(Date.now() + 3*24*60*60*1000),
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      token,
      user: userObj,
      message: "Login successful",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success:false, message:"Login failed" });
  }
};
