import mongoose from "mongoose";
const { Schema } = mongoose;

// Need this to categorize quiz questions

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: { type: String },
    iconUrl: { type: String },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Category", categorySchema);
