import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  fullName: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: "" },
  role : { type: String, default: "admin" },
  provider: { type: String, default: "credentials" },
}, { timestamps: true });

export default mongoose.models.Admins || mongoose.model('Admins', adminSchema);