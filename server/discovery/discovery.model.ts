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

recommendationSchema.index({ userId: 1 });
export const Recommendation = mongoose.models.Recommendation || mongoose.model('Recommendation', recommendationSchema);