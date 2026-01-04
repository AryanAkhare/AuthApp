const bcrypt = require("bcrypt");           // For hashing passwords
const User = require("../model/user");      // User model

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
