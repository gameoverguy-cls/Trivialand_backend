import mongoose from "mongoose";
const { Schema } = mongoose;

const quizAttemptSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    score: { type: Number },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model("QuizAttempt", quizAttemptSchema);
