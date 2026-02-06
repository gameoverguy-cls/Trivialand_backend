import mongoose from "mongoose";
const { Schema } = mongoose;

const subCategorySchema = new Schema(
  {
    name: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: { type: String },
    iconUrl: { type: String },
  },
  { timestamps: true },
);

subCategorySchema.index({ name: 1, categoryId: 1 }, { unique: true });

export default mongoose.model("SubCategory", subCategorySchema);
