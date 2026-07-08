import mongoose from 'mongoose';

const subscriptionPlansSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    category: { type: String, enum: ["parent", "babysitter", "both"], required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    durationUnit: { type: String, enum: ["free", "months", "years"], default: "months" },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isPopular: { type: Boolean, default: false },
    isDiscounted: { type: Boolean, default: false },
    discountPercentage: { type: Number, default: 0 },
    stripeProductId: { type: String, default: null },
    stripeMonthlyPriceId: { type: String, default: null },
    stripeYearlyPriceId: { type: String, default: null },
    stripeTestProductId: { type: String, default: null },
    stripeTestMonthlyPriceId: { type: String, default: null },
    stripeTestYearlyPriceId: { type: String, default: null }
}, { timestamps: true });

subscriptionPlansSchema.index({ category: 1 });

export default mongoose.models.SubscriptionPlans || mongoose.model('SubscriptionPlans', subscriptionPlansSchema);