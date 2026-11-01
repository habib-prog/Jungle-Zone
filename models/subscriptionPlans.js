import mongoose from 'mongoose';

const subscriptionPlansSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    category: { type: String, enum: ["parent", "babysitter", "both"], required: true },
    serviceCategory: {
        type: String,
        enum: ["all", "babysitting", "cleaning", "cooking"],
        default: "all",
        index: true,
    },
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

// Next.js may keep a previously compiled Mongoose model during hot reload.
// Recompile it when that cached schema predates serviceCategory so edits are
// not silently dropped from existing plan updates.
const cachedSubscriptionPlans = mongoose.models.SubscriptionPlans;
if (cachedSubscriptionPlans && !cachedSubscriptionPlans.schema.path("serviceCategory")) {
    delete mongoose.models.SubscriptionPlans;
}

export default mongoose.models.SubscriptionPlans || mongoose.model('SubscriptionPlans', subscriptionPlansSchema);
