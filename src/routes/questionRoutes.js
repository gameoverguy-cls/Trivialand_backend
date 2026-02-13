import express from "express";
import {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
} from "../controllers/questionController.js";

const router = express.Router();

router.post("/", createQuestion);
router.get("/", getQuestions);
router.get("/:id", getQuestionById);
router.patch("/:id", updateQuestion);

export default router;
