require("dotenv").config();
const express = require("express");

const app = express();
const PORT = process.env.PORT || 4000;
const cookieparser = require("cookie-parser");
const cors = require("cors");

// Middleware
app.use(cookieparser());
app.use(express.json());

// Enable CORS with credentials from client origin
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Simple request & cookie logger for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("cookies:", req.cookies);
  next();
});

// DB connect
require("./config/database.js").connectDB();

// Routes
const user = require("./routes/user");
app.use("/api/v1", user);

// Server
app.listen(PORT, () => {
  console.log(`App listening at ${PORT}`);
});
