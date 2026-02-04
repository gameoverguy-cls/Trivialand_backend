import express from "express";
import {
  startQuizAttempt,
  finishQuizAttempt,
  getQuizAttemptById,
  getUserQuizAttempts,
} from "../controllers/quizAttemptController.js";

const router = express.Router();

// start a quiz
router.post("/start", startQuizAttempt);

// finish a quiz
router.patch("/:id/finish", finishQuizAttempt);

// get one attempt
router.get("/:id", getQuizAttemptById);

// get logged-in user's attempts
router.get("/me/history", getUserQuizAttempts);

export default router;
