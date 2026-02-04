import mongoose from "mongoose";
const { Schema } = mongoose;

const questionSchema = new Schema(
  {
    questionText: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "MCQ_SINGLE",
        "MCQ_MULTI",
        "TRUE_FALSE",
        "ODD_ONE_OUT",
        "MATCH_FOLLOWING",
        "ORDERING",
        "IMAGE_MCQ",
        "AUDIO_MCQ",
        "VIDEO_MCQ",
      ],
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
    subCategories: [{ type: Schema.Types.ObjectId, ref: "SubCategory" }],
  },
  { timestamps: true },
);

export default mongoose.model("Question", questionSchema);
