import mongoose from "mongoose";
const { Schema } = mongoose;
import { MODES } from "./constants/types";

const optionSnapshotSchema = new Schema(
  {
    text: String,
    mediaUrl: String,
    isCorrect: Boolean,
    matchKey: String,
    matchSide: { type: String, enum: ["LEFT", "RIGHT"] },
    correctOrder: Number,
  },
  { _id: false },
);

const questionSnapshotSchema = new Schema({
  questionId: { type: Schema.Types.ObjectId }, // original reference (optional)

  questionText: String,
  type: String,
  difficulty: String,

  mediaType: String,
  mediaUrl: String,

  options: [optionSnapshotSchema],
  timeLimit: Number,
});

const quizSchema = new Schema(
  {
    title: { type: String, required: true },
    mode: { type: String, enum: MODES, required: true, index: true },
    quizType: {
      type: String,
      enum: QUIZ_TYPES,
      required: true,
    },
    questions: [questionSnapshotSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Quiz", quizSchema);
