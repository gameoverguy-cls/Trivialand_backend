import mongoose from "mongoose";
const { Schema } = mongoose;

const optionSchema = new Schema(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
      index: true,
    },

    // display
    text: { type: String, required: true },
    mediaUrl: { type: String },

    // 🔹 MCQ / TRUE_FALSE
    isCorrect: { type: Boolean, default: false },

    // 🔹 MATCH_FOLLOWING
    matchKey: { type: String }, // same value = correct pair
    matchSide: {
      type: String,
      enum: ["LEFT", "RIGHT"],
    },

    // 🔹 ORDERING / SEQUENCE
    correctOrder: { type: Number }, // 1,2,3...
  },
  { timestamps: true },
);

optionSchema.index({ questionId: 1, text: 1 }, { unique: true });

export default mongoose.model("Option", optionSchema);
