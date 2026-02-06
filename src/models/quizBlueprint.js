import mongoose from "mongoose";
import { QUESTION_TYPES } from "./constants/types";
const { Schema } = mongoose;

const quizBlueprintSchema = new Schema(
  {
    stars: {
      type: Number, // 1–10, 20–2500 later
      required: true,
      index: true,
    },

    mode: {
      type: String,
      enum: ["NORMAL", "HARDCORE"],
      required: true,
      index: true,
    },

    totalQuestions: {
      type: Number,
      default: 20,
    },

    difficultyDistribution: {
      EASY: Number,
      MEDIUM: Number,
      HARD: Number,
    },

    typeDistribution: {
      type: Map,
      of: Number, // count per question type
      default: {},
    },

    allowedTypes: [
      {
        type: String,
        enum: QUESTION_TYPES,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("QuizBlueprint", quizBlueprintSchema);
