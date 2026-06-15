import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  category: { type: String, enum: ["parent", "babysitter"], required: true },
  subscriptionPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlans', required: true },
  planName: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "gbp" },
  stripePaymentIntentId: { type: String },
  stripeSessionId: { type: String, unique: true },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  stripePriceId: { type: String },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "cancelled", "refunded"],
    default: "pending"
  },
  paymentMethod: { type: String },
  billingCycle: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
  nextPaymentDate: { type: Date },
  failureReason: { type: String },
  receiptUrl: { type: String },
  invoiceId: { type: String },
}, { timestamps: true });

paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ stripeSessionId: 1 });
paymentSchema.index({ status: 1 });

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
