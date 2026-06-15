import mongoose from "mongoose";

const BabySitterRegistrationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    profilePhoto: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    location: { type: String, required: true },
    zipCode: { type: Number, required: true },
    description: { type: String, default: null },
    certifications: [{ type: String, default: null }],
    educationLevel: { type: String, default: null },
    preferredBabysittingLocation: {
      type: String,
      enum: ["At Babysitter's", "At Parent's"],
      default: null,
    },
    languages: [{ type: String, default: null }],
    yearsOfExperience: { type: Number, default: null },
    hourlyRate: { type: Number, default: null },
    comfortableWithAgeGroup: [{ type: String, default: null }],
    skills: [{ type: String, default: null }],
    role: { type: String, default: "sitter" },
    availability: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          required: true,
        },
        timeSlots: {
          morning: { type: Boolean, default: false },
          afternoon: { type: Boolean, default: false },
          evening: { type: Boolean, default: false },
          night: { type: Boolean, default: false },
        },
      },
    ],
    verificationDocs: [{ type: String, default: null }],
    lastActivity: { type: Date, default: null },
    mapLink: { type: String, default: null },
    driverLicense: { type: Boolean, default: false },
    hasCar: { type: Boolean, default: false },
    hasChildren: { type: Boolean, default: false },
    isSmoker: { type: Boolean, default: false },
    characteristics: [{ type: String, default: null }],
    educationDetails: { type: String, default: null },
    comfortableWith: [{ type: String, default: null }],
    governmentIdVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    googleAccountVerified: { type: Boolean, default: false },
    isFavorite: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlans', default: null },
    subscription: { type: String, default: "free" },
    subscriptionStart: { type: Date, default: null },
    subscriptionExpiry: { type: Date, default: null },
  },
  { timestamps: true },
);

BabySitterRegistrationSchema.index({ isApproved: 1, createdAt: -1 });
BabySitterRegistrationSchema.index({ isApproved: 1, zipCode: 1 });
BabySitterRegistrationSchema.index({ isApproved: 1, hourlyRate: 1 });
BabySitterRegistrationSchema.index({ "availability.day": 1 });

const BabySitterRegistration =
  mongoose.models["baby-sitter-auth"] ||
  mongoose.model("baby-sitter-auth", BabySitterRegistrationSchema);

export default BabySitterRegistration;
