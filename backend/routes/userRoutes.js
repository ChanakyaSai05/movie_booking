const express = require("express");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middlewares/authMiddleware");
const EmailHelper = require("../utils/emailHelper");
const { 
  validateUserRegistration, 
  validateUserLogin, 
  validatePasswordReset, 
  validateEmail 
} = require("../middlewares/validationMiddleware");
const { authLimiter, emailLimiter } = require("../middlewares/rateLimitMiddleware");

const userRouter = express.Router();

userRouter.post("/register", authLimiter, ...validateUserRegistration, async (req, res) => {
  try {
    const userExists = await userModel.findOne({ email: req.body.email });
    if (userExists) {
      return res.send({ success: false, message: "User already exists" });
    }
    
    // Hash password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    
    const newUser = new userModel({
      ...req.body,
      password: hashedPassword
    });
    await newUser.save();

    return res.send({
      success: true,
      message: "User registered successfully, Please login",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

userRouter.post("/login", authLimiter, ...validateUserLogin, async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    console.log("user", user);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    
    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.send({ success: false, message: "Invalid password" });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    console.log(token);
    res.send({
      success: true,
      message: "User logged in successfully",
      data: token,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

userRouter.get("/get-current-user", authMiddleware, async (req, res) => {
  const user = await userModel.findById(req.user.userId).select("-password");
  res.send({
    success: true,
    message: "You are authorized to go to the protected route",
    data: user,
  });
});

const otpGenerator = function () {
  return Math.floor(100000 + Math.random() * 900000); // ranger from 100000 to 999999
};

userRouter.patch("/forgetpassword", emailLimiter, ...validateEmail, async (req, res) => {
  try {
    if (req.body.email === undefined) {
      return res
        .status(401)
        .json({ status: "failure", message: "Email is required" });
    }
    const user = await userModel.findOne({ email: req.body.email });
    if (user == null) {
      return res
        .status(404)
        .json({ status: "failure", message: "User not found" });
    }
    const otp = otpGenerator();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();
    await EmailHelper("otp.html", user.email, { name: user.name, otp: otp });
    res
      .status(200)
      .json({ status: "success", message: "OTP sent to your email" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

userRouter.patch("/resetpassword/:email", authLimiter, ...validatePasswordReset, async (req, res) => {
  try {
    const resetDetails = req.body;
    if (!req.params.email || !resetDetails.otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }
    const user = await userModel.findOne({ email: req.params.email });
    if (user == null) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // Verify OTP
    if (user.otp !== resetDetails.otp) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid OTP" });
    }
    // if otp is expired
    if (Date.now() > user.otpExpiry) {
      return res
        .status(401)
        .json({ success: false, message: "OTP has expired" });
    }
    
    // Hash new password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(resetDetails.password, saltRounds);
    
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res
      .status(200)
      .json({ status: "success", message: "Password reset successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = userRouter;
