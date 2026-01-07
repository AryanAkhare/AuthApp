const express = require("express");
const router = express.Router();

const { login, signup } = require("../controllers/auth");
const {auth,isStudent,isAdmin}=require("../middlewares/auth")

router.post("/login", login);
router.post("/signup", signup);

// Simple debug route to inspect headers & cookies (no auth)
router.get("/debug", (req, res) => {
  res.json({ cookies: req.cookies, headers: req.headers });
});

//protected routes
router.get("/test",auth,(req,res)=>{
    res.json({
        sucess:true,
        message:"Dummy protected."
    })
})
router.get("/student",auth,isStudent,(req,res)=>{
    res.json({
        sucess:true,
        message:"Welcome to student protected route."
    })
})

router.get("/admin",auth,isAdmin,(req,res)=>{
    res.json({
        sucess:true,
        message:"Welcome to admin protected route."
    })
})

module.exports = router;
