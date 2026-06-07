import mongoose, { Schema } from "mongoose";

const recommendationSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    items: [{
        contentId: String,
        score: Number,
        reason: String,
    }],
    calculatedAt: {
        type: Date,
        default: Date.now(),
    }
});

// No need for recommendationSchema.index({ userId: 1 }) — unique: true already creates an index
export const Recommendation = mongoose.models.Recommendation || mongoose.model('Recommendation', recommendationSchema);