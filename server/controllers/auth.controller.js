import genToken from "../config/token.js";
import User from "../models/user.model.js";

// ✅ GOOGLE LOGIN
export const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
      });
    }

    const token = await genToken(user._id);

    // ✅ FIXED COOKIE
    res.cookie("token", token, {
      httpOnly: true,      // ✅ IMPORTANT
      secure: true,       // localhost
      sameSite: "none",     // ✅ IMPORTANT
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    return res.status(500).json({
      message: `Google auth error ${error}`,
    });
  }
};

// ✅ LOGOUT
export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "Logged out successfully ✅",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Logout error ${error}`,
    });
  }
};
