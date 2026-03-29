import mongoose, { Schema } from "mongoose";

const watchlistProjectionSchema = new Schema({
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

watchlistProjectionSchema.index({ userId: 1, contentId: 1 }, { unique: true });
watchlistProjectionSchema.index({ userId: 1, addedAt: -1 });

export const WatchListProjection = mongoose.models.WatchListProjection 
    || mongoose.model('WatchListProjection', watchlistProjectionSchema);