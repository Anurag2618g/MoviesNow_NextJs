import mongoose, { Schema } from "mongoose";

const watchHistorySchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        contentId: {
            type: String,
            required: true,
        },
        progress: {
            type: String,
            required: true,
            default: 0,
        },
        duration: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["in_progress", "completed"],
            default: "in_progress",
        },
        lastWatchedAt: {
            type: Date,
            default: Date.now,
        }
    },
    { timestamps: true}
);

watchHistorySchema.index({ userId: 1, contentId: 1 }, { unique: true });

export default mongoose.models.WatchHistory || mongoose.model("WatchHistory", watchHistorySchema);