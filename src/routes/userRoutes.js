import express from "express";

import {
  getMe,
  updateProfile,
  getUserQuizAttempts,
  setUserBlockStatus,
  deleteUser,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= USER =================

// Logged-in user profile
router.get("/me", authMiddleware, getMe);

// Update own profile
router.patch("/me", updateProfile);

// Logged-in user's quiz history
router.get("/me/quiz-attempts", getUserQuizAttempts);

// ================= ADMIN =================

// Block / Unblock user
router.patch("/:userId/block", setUserBlockStatus);

// Delete user
router.delete("/:userId", deleteUser);

export default router;
