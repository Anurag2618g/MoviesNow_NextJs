import mongoose, { Schema } from "mongoose";

const trendingSchema = new Schema(
    {
        contentId: {
            type: String,
            required: true,
            unique: true,
        },
        score: {
            type: Number,
            default: 0,
        },
        lastActivityAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true } ,
);

trendingSchema.index({ score: -1 });

export const Trending = mongoose.models.Trending || mongoose.model('Trending', trendingSchema);