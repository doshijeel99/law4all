import { model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    personalDetails: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      phone: { type: String, default: "+1234567890" },
      dateOfBirth: { type: Date },
      gender: { type: String, enum: ["Male", "Female", "Other"] },
      occupation: { type: String },
      nationality: { type: String },
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
      googleMapLink: { type: String },
    },
    previousCaseHistory: [
      {
        caseId: { type: String, required: true },
        caseType: { type: String, required: true },
        caseDescription: { type: String },
        filingDate: { type: Date },
        status: {
          type: String,
          enum: ["Open", "In Progress", "Closed"],
          default: "Open",
        },
        outcome: { type: String },
        lawyer: {
          name: { type: String },
          firm: { type: String },
        },
        documents: [
          {
            documentType: { type: String },
            documentId: { type: String },
            uploadDate: { type: Date },
            fileUrl: { type: String },
          },
        ],
      },
    ],
    legalDocuments: [
      {
        documentType: { type: String },
        documentId: { type: String },
        uploadDate: { type: Date },
        fileUrl: { type: String },
      },
    ],
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

const User = model("User", UserSchema);

export default User;
