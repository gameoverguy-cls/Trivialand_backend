import mongoose from "mongoose";
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
      MCQ_SINGLE: Number,
      MCQ_MULTI: Number,
      TRUE_FALSE: Number,
      MATCH_FOLLOWING: Number,
      ORDERING: Number,
    },

    allowedTypes: [
      {
        type: String,
        enum: [
          "MCQ_SINGLE",
          "MCQ_MULTI",
          "TRUE_FALSE",
          "MATCH_FOLLOWING",
          "ORDERING",
        ],
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("QuizBlueprint", quizBlueprintSchema);
