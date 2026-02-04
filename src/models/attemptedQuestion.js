import mongoose from "mongoose";
const { Schema } = mongoose;

const attemptedQuestionSchema = new Schema(
  {
    quizAttemptId: {
      type: Schema.Types.ObjectId,
      ref: "QuizAttempt",
      required: true,
      index: true,
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
      index: true,
    },
    attemptCount: { type: Number, default: 1 },

    // Outcome
    isCorrect: { type: Boolean },
    score: { type: Number },

    // Optional: timestamp of attempt
    attemptedAt: { type: Date, default: Date.now },

    // Optional: snapshot or metadata
    meta: Schema.Types.Mixed,
  },
  { timestamps: true },
);

// Ensure uniqueness per quizAttempt + question + attempt count
attemptedQuestionSchema.index(
  { quizAttemptId: 1, questionId: 1, attemptCount: 1 },
  { unique: true },
);

export default mongoose.model("AttemptedQuestion", attemptedQuestionSchema);
