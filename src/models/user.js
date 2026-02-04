import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    refreshToken: { type: String },
    profileImage: { type: String },
    provider: { type: String, enum: ["LOCAL", "GOOGLE", "FACEBOOK"] },
    providerId: { type: String },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
