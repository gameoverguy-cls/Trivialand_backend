import mongoose from "mongoose";
const { Schema } = mongoose;
import { MODES, MATCH_OPTION_SIDE } from "./constants/types";

const optionSnapshotSchema = new Schema(
  {
    optionText: { type: String, required: true },
    mediaUrl: { type: String },
    isCorrect: { type: Boolean, default: false },
    matchKey: { type: String },
    matchSide: { type: String, enum: MATCH_OPTION_SIDE },
    correctOrder: { type: Number },
  },
  { _id: false },
);

const questionSnapshotSchema = new Schema(
  {
    questionId: { type: Schema.Types.ObjectId }, // reference to original question
    questionText: { type: String },
    type: { type: String },
    difficulty: { type: String },
    mediaType: { type: String },
    mediaUrl: { type: String },
    category: { type: String }, //name of category
    tags: [{ type: String }], //names of tags
    marks: { type: Number },
    options: [optionSnapshotSchema],
    timeLimit: { type: Number },
  },
  { _id: false },
);

const quizSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    mode: { type: String, enum: MODES, required: true, index: true },
    quizType: {
      type: String,
      enum: QUIZ_TYPES,
      required: true,
    },
    questions: [questionSnapshotSchema],
    version: { type: Number, default: 1 },
    parentQuizId: { type: Schema.Types.ObjectId, ref: "Quiz" },
    totalQuestions: { type: Number }, // fast access, no array length calc
    totalMarks: { type: Number }, // scoring reference
    timeLimit: { type: Number }, // quiz-level timer (seconds)
    passingScore: { type: Number }, // % or marks to pass
    isActive: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: false },
    totalAttempts: { type: Number, default: 1 },
    shuffleQuestions: { type: Boolean, default: true },
    shuffleOptions: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.model("Quiz", quizSchema);
