import mongoose from "mongoose";
import {
  QUESTION_TYPES,
  DIFFICULTY,
  MEDIA_TYPES,
  MATCH_OPTION_SIDE,
} from "./constants/types";
const { Schema } = mongoose;

const optionSchema = new Schema(
  {
    optionText: { type: String },
    mediaUrl: { type: String },
    isCorrect: { type: Boolean, default: false },
    matchKey: { type: String },
    matchSide: { type: String, enum: MATCH_OPTION_SIDE },
    correctOrder: { type: Number },
  },
  { _id: false },
);

const questionSchema = new Schema(
  {
    questionText: { type: String, required: true },
    type: { type: String, enum: QUESTION_TYPES, required: true },
    difficulty: {
      type: String,
      enum: DIFFICULTY,
      required: true,
      default: "EASY",
    },
    mediaType: {
      type: String,
      enum: MEDIA_TYPES,
      required: true,
      default: "NONE",
    },
    mediaUrl: { type: String },

    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],

    options: [optionSchema],

    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 10 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.model("Question", questionSchema);
