import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ success: true, message: "User registered" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }

    if (user.isBlocked) {
      return res
        .status(403)
        .json({ success: false, message: "Your account is blocked." });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Please login using your google account",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15d",
      },
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "90d",
      },
    );

    // store refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      refreshToken,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server Error" });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential)
      return res.status(400).json({ message: "Missing Google credential" });

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    if (!email || !name)
      return res.status(400).json({ message: "Invalid Google account" });

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        profileImage: picture,
        provider: "GOOGLE",
        providerId: sub,
      });
    } else if (!user.profileImage) {
      user.profileImage = picture;
      await user.save();
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account is blocked" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15d",
      },
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "90d",
      },
    );

    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      token,
      refreshToken,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Server Error" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ msg: "No token provided" });

    // verify token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ msg: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15d",
      },
    );

    return res.status(200).json({
      success: true,
      message: "New Access Token generated",
      token: newAccessToken,
    });
  } catch (err) {
    return res.status(403).json({ success: false, message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res
        .status(400)
        .json({ success: false, message: "refreshToken required" });

    let decoded;

    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        // Token is expired, but we can still remove it from DB if exists
        decoded = jwt.decode(refreshToken); // decode without verifying
      } else throw err;
    }

    if (decoded) {
      const user = await User.findById(decoded.userId);
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
