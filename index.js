require("dotenv").config();
const express = require("express");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

//cookie parser

// DB connect
require("./config/database.js").connectDB();

// Routes
const user = require("./routes/user");
app.use("/api/v1", user);

// Server
app.listen(PORT, () => {
  console.log(`App listening at ${PORT}`);
});
