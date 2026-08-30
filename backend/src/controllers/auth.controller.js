import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password || typeof identifier !== "string" || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid string username/email and password are required.",
      });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    const user = await User.findOne({
      $or: [
        { username: cleanIdentifier },
        { email: cleanIdentifier },
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("User login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};