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
    legalNeeds: {
      type: [String], // Example: ["immigration", "employment law", "family law"]
      default: [],
    },
    legalNeeds: {
      type: [String], // Example: ["immigration", "employment law", "family law"]
      default: [],
    },
    activeCases: [
      {
        caseId: String,
        caseType: String, // Example: "Employment Dispute", "Criminal Defense"
        status: { type: String, enum: ["open", "in progress", "closed"], default: "open" },
        lastUpdated: { type: Date, default: Date.now },
      },
    ],
    
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
