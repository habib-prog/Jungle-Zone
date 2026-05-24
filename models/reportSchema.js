import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    sitter: { type: mongoose.Schema.Types.ObjectId, ref: "baby-sitter-auth", required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
    report: { type: String },
}, { timestamps: true });

export default mongoose.modelNames.Report || mongoose.model('Report', reportSchema);