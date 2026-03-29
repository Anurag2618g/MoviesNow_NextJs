import mongoose, { Schema } from "mongoose";

const watchlistSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },

    contentId: {
        type: String,
        required: true,
    },

    addedAt: {
        type: Date,
        default: Date.now(),
    },
}, { timestamps: true }
);

watchlistSchema.index({ userId: 1, contentId: 1 }, { unique: true });
watchlistSchema.index({ userId: 1, addedAt: -1 });

export const WatchList = mongoose.models.WatchList || mongoose.model('WatchList', watchlistSchema);