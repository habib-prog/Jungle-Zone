import mongoose from "mongoose";

const BabySitterRegistrationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    profilePhoto: { type: String, required: true },
    age: { type: Number, required: true },
    dateOfBirth: { type: Date, default: null },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    location: { type: String, required: true },
    zipCode: { type: String, required: true },
    description: { type: String, default: null },
    certifications: [{ type: String }],
    educationLevel: { type: String, default: null },
    preferredBabysittingLocation: {
      type: String,
      enum: ["At Babysitter's", "At Parent's"],
      default: null,
    },
    languages: [{ type: String }],
    yearsOfExperience: { type: Number, default: null },
    hourlyRate: { type: Number, default: null },
    comfortableWithAgeGroup: [{ type: String }],
    skills: [{ type: String }],
    role: { type: String, default: "sitter" },
    characteristics: [{ type: String }],
    comfortableWith: [{ type: String }],
    educationDetails: { type: String, default: null },
    driverLicense: { type: Boolean, default: null },
    hasCar: { type: Boolean, default: null },
    hasChildren: { type: Boolean, default: null },
    isSmoker: { type: Boolean, default: null },
    mapLink: { type: String, default: null },
    lastActivity: { type: Date, default: null },
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
    verificationDocs: [{ type: String }],
    preferences: [{ type: String }],
    governmentIdVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    googleAccountVerified: { type: Boolean, default: false },
    otp: { type: String, default: "" },
    otpExpires: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date, default: null },
    APPROVAL_WAIT_HOURS: { type: Number, default: 72 },
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
