import express from "express";
import genToken from "../config/token.js";
import User from "../models/user.model.js";

const router = express.Router();

console.log("Auth route loaded ✅");

// ✅ Google Login
router.post("/google", async (req, res) => {
  try {
    const { name, email } = req.body;

    // ✅ Find user
    let user = await User.findOne({ email });

    // ✅ Create if not exist
    if (!user) {
      user = await User.create({ name, email });
    }

    // ✅ Generate token using userId
    const token = await genToken(user._id);

    // ✅ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({
      success: true,
      message: "Login successful ✅",
      user,
    });

  } catch (error) {
    console.error("Google Auth Error:", error);

    res.status(500).json({
      success: false,
      message: "Login failed ❌",
    });
  }
});

// ✅ Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");

  res.json({
    success: true,
    message: "Logged out successfully ✅",
  });
});

export default router;

