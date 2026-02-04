import mongoose from "mongoose";
const { Schema } = mongoose;

// Contains all the quizzes available in the system

const quizSchema = new Schema(
  {
    title: { type: String, required: true },
    quizType: {
      type: String,
      enum: ["PREDEFINED", "RANDOM", "DAILY", "TOURNAMENT"],
      required: true,
    },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  },
  { timestamps: true },
);

export default mongoose.model("Quiz", quizSchema);
