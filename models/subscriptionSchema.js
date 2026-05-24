import mongoose from 'mongoose';
import parentSchema from './parentSchema';
import BabySitterRegistration from './BabySitterRegistrationSchema';

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  category: { type: String, enum: ["parent", "babysitter"], required: true },
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlans', required: true },
  plan: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  paymentMethod: { type: String },
  transactionId: { type: String },
  stripeSubscriptionId: { type: String },
  stripeCustomerId: { type: String },
  paymentStatus: { type: String, enum: ["active", "past_due", "unpaid", "cancelled"], default: "active" },
  nextPaymentDate: { type: Date },
  billingCycle: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
  lastPaymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
}, { timestamps: true });

subscriptionSchema.methods.populateUser = async function () {
  const Model = this.category === "parent" ? parentSchema : BabySitterRegistration;
  this.user = await Model.findById(this.userId).select("-password");
  return this;
};

export default mongoose.models.Subscriptions || mongoose.model('Subscriptions', subscriptionSchema);