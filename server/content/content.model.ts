import mongoose, { Schema } from "mongoose";

const contentSchema = new Schema(
    {
        contentId: {
            type: String,
            required: true,
            unique: true,
        },
        type: {
            type: String,
            enum: ['movie', 'tv'],
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        posterPath: {
            type: String,
            default: null,
        },
        backdropPath: {
            type: String,
            default: null,
        },
        rating: {
            type: Number,
            default: null,
        },
        genres: {
            type: [Number],
            default: [],
        },
        releasedAt: {
            type: Date,
            default: null,
        },
        snapshotUpdatedAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

contentSchema.index({ contentId: 1 });
export const Content = mongoose.models.Content || mongoose.model('Content', contentSchema);