import mongoose, { Schema } from "mongoose";

const ContinueWatchingSchema = new Schema({
    userId: String,
    contentId: String,
    progress: Number,
    duration: Number,
    lastWatchedAt: Date,
});

ContinueWatchingSchema.index({ userId: 1, lastWatchedAt: -1 });

export const ContinueWatching = mongoose.models.ContinueWatching || mongoose.model("ContinueWatching", ContinueWatchingSchema);