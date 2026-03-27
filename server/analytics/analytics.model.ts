import mongoose, { Schema } from "mongoose";

const analyticsSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    totalWatchTime: {
        type: Number,
        default: 0,
    },
    totalCompleted: {
        type: Number,
        default: 0,
    },
    totalStarted: {
        type: Number,
        default: 0,
    },
    genreCount: {
        type: Map,
        of: Number,
        default: {},
    }
}, { timestamps: true });

export const Analytics = mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema);