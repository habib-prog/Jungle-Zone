import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    sitter: { type: mongoose.Schema.Types.ObjectId, ref: "baby-sitter-auth", required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
    rating: { type: Number, required: true },
    review: { type: String },
}, { timestamps: true });

export default mongoose.modelNames.Review || mongoose.model('Review', reviewSchema);