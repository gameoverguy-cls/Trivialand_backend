import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  googleAuth,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/googleauth", googleAuth);
router.post("/refresh_token", refreshToken);
router.post("/logout", logout);

export default router;
