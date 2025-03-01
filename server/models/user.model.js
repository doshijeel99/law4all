import { model, Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    userName: { type: String, required: true },
    profileImageUrl: { type: String },
    age: { type: Number },
    phoneNumber: { type: String, default: "4242424242" },
    location: { type: String, default: "Mumbai, Maharashtra" },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
