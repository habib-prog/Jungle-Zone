import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    userId: { type: String, default: null },
    email: { type: String, default: "" },
    name: { type: String, default: "" },
    role: { type: String, default: "" },
    action: {
      type: String,
      enum: ["login", "logout"],
      required: true,
    },
    device: { type: String, default: "Unknown" },
    region: { type: String, default: "Unknown" },
    ip: { type: String, default: "" },
  },
  { timestamps: true },
);

activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

export default mongoose.models.ActivityLog ||
  mongoose.model("ActivityLog", activityLogSchema);
