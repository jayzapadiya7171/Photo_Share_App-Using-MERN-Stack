import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";
// -----------------------------
// 🔐 Generate JWT Token
// -----------------------------
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Common cookie settings (used in login/register/logout)
const cookieOptions = {
  httpOnly: true,
  secure: false, // set to true only in production (HTTPS)
  sameSite: "Strict",
  path: "/", 
};

// -----------------------------
// 🧩 REGISTER
// -----------------------------
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.cookie("jwt", token, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// -----------------------------
// 🧩 LOGIN
// -----------------------------
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.cookie("jwt", token, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// -----------------------------
// ✅ LOGOUT
// -----------------------------
export const logoutUser = (req, res) => {
  // ✅ Force cookie deletion by setting expiry to past date
  res.cookie("jwt", "", {
    ...cookieOptions,
    expires: new Date(0),
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

// -----------------------------
// 👤 GET PROFILE
// -----------------------------
export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Not authorized" });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Profile 

export const updateProfile = async (req, res) => {
  try {
    

    const { name, email, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      console.log("❌ User not found in DB");
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Update name & email
    user.name = name || user.name;
    user.email = email || user.email;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      user.password = newPassword;
    }

    await user.save();
    console.log("✅ User updated successfully");

    res.json({
      message: "Profile updated successfully",
      user: { name: user.name, email: user.email },
    });

  } catch (error) {
    console.error("🔥 ERROR in updateProfile:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// FORGOT_PASSWORD

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔐 Create reset token (valid 15 mins)
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // ✅ Must match your React app URL (from .env)
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // 📩 Send email
    await sendEmail({
      to: user.email,
      subject: "Password Reset Link",
      message: `Click here to reset your password:\n\n${resetUrl}`,
    });

    res.json({ message: "Password reset link sent to email ✅" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


// RESET_PASSWORD

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) return res.status(400).json({ message: "Password required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "Invalid token or user not found" });

    user.password = password; // auto-hash in model
    await user.save();

    res.json({ message: "Password reset successfully ✅" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};
