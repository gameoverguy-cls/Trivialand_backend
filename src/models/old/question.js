import mongoose from "mongoose";
import { QUESTION_TYPES } from "./constants/questionTypes";
const { Schema } = mongoose;

const questionSchema = new Schema(
  {
    questionText: { type: String, required: true },
    type: {
      type: String,
      enum: QUESTION_TYPES,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"],
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["NONE", "IMAGE", "AUDIO", "VIDEO"],
      required: true,
    },
    mediaUrl: { type: String },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    isActive: { type: Boolean, default: true },
    timeLimit: { type: Number }, // seconds
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.model("Question", questionSchema);
