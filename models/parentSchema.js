import mongoose from 'mongoose';

const parentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: "" },
  picture: { type: String, default: "" },
  password: { type: String, default: "" },
  postCode: { type: String, default: "" },
  provider: { type: String, default: "credentials" },
  houseNo: { type: String },
  role: { type: String, default: "parent" },
  road: { type: String },
  state: { type: String },
  moreInfo: { type: String },
  nationalId: { type: String },
  wallet: { type: Number, default: 0 },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlans', default: null },
  subscription: { type: String, default: "free" },
    subscriptionStart: { type: Date, default: null },
  subscriptionExpiry: { type: Date, default: "" },
  totalDeals: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Parent || mongoose.model('Parent', parentSchema);