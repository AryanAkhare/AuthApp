const jwt = require("jsonwebtoken");
require("dotenv").config();

// ================= AUTH MIDDLEWARE =================
exports.auth = (req, res, next) => {
  try {

      console.log("auth middleware start", { cookies: req.cookies, headers: req.headers });
      console.log("cookie", req.cookies?.token);
      console.log("body", req.body?.token);
    //
    // Get token from body or Authorization header
    const token =
    req.cookies.token ||
      req.body.token ||
      req.headers.authorization?.replace("Bearer ", ""); //safest

    // If token not found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    try {
      // Verify token using secret key
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      // Attach decoded data to request
      req.user = payload;

      next(); // Move to next middleware
    } catch (err) {
      // Token verification failed
      return res.status(401).json({
        success: false,
        message: "Token invalid",
      });
    }
  } catch (error) {
    // General error
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

// ================= STUDENT ROLE CHECK =================
exports.isStudent = (req, res, next) => {
  // Allow only students
  if (req.user.role !== "Student") {
    return res.status(403).json({
      success: false,
      message: "Protected route for students only",
    });
  }

  next(); // User is a student
};

// ================= ADMIN ROLE CHECK =================
exports.isAdmin = (req, res, next) => {
  // Allow only admins
  if (req.user.role !== "Admin") {
    return res.status(403).json({
      success: false,
      message: "Protected route for admins only",
    });
  }

  next(); // User is an admin
};
