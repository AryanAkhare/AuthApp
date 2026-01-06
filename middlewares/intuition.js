/*
===============================================================================
THEORY & INTUITION (READ THIS FIRST)
===============================================================================

1) AUTHENTICATION vs AUTHORIZATION
---------------------------------
Authentication  = Who are you?
Authorization   = What are you allowed to access?

JWT handles authentication.
Role checks handle authorization.


2) WHY PASSWORD HASHING (bcrypt)?
---------------------------------
- Plain passwords should NEVER be stored.
- If DB leaks, hashed passwords still protect users.
- bcrypt uses:
    - Salt (randomness)
    - Multiple rounds (slow hashing)
- Slowness = security against brute-force attacks.

Important:
- We never "decrypt" passwords.
- We only compare hashes.


3) bcrypt.hash(password, saltRounds)
------------------------------------
Purpose:
- Converts plain password → hashed password

Why saltRounds?
- Higher rounds = slower hash = more secure
- Common value = 10

Used during:
- SIGNUP


4) bcrypt.compare(plainPassword, hashedPassword)
------------------------------------------------
Purpose:
- Checks if entered password matches stored hash

How it works:
- bcrypt hashes the entered password internally
- Compares the two hashes
- Returns true / false

Used during:
- LOGIN


5) WHAT IS JWT?
--------------
JWT = JSON Web Token

- A compact string that proves user identity
- Stateless (no server-side session storage)
- Sent by client on every request


6) jwt.sign(payload, secret, options)
-------------------------------------
Purpose:
- Creates a JWT token

Payload:
- Small user info (id, role)
- NEVER include password

Secret:
- Used to sign token
- Must be kept private

Options:
- expiresIn controls token lifetime

Used during:
- LOGIN (after password verification)


7) jwt.verify(token, secret)
----------------------------
Purpose:
- Validates token authenticity

Checks:
- Token is not tampered
- Token is not expired

Returns:
- Decoded payload

Used during:
- PROTECTED ROUTES


8) TOKEN FLOW (BIG PICTURE)
---------------------------
Signup:
  password → bcrypt.hash → store in DB

Login:
  entered password → bcrypt.compare
  if valid → jwt.sign → send token to client

Request:
  client sends token → jwt.verify → allow access


9) WHY JWT IS STATELESS?
-----------------------
- No session stored on server
- Scales well for APIs
- Server trusts token, not memory


10) COMMON MISTAKES
------------------
- Storing plain passwords ❌
- Putting password inside JWT ❌
- Forgetting token expiry ❌
- Not using try/catch with jwt.verify ❌

===============================================================================
CODE STARTS BELOW
===============================================================================
*/

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ------------------ SIGNUP ------------------
exports.signup = async (req, res) => {
  const { password } = req.body;

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  res.json({
    message: "Password hashed",
    hashedPassword,
  });
};

// ------------------ LOGIN ------------------
exports.login = async (req, res) => {
  const { password } = req.body;

  // Mock stored hash (normally from DB)
  const storedHash = "$2b$10$abcdef...";

  // Compare entered password with stored hash
  const isMatch = await bcrypt.compare(password, storedHash);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  // Create JWT after successful login
  const token = jwt.sign(
    { id: "123", role: "Student" },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({ token });
};

// ------------------ AUTH MIDDLEWARE ------------------
exports.auth = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  // Verify token before allowing access
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decoded;
  next();
};
