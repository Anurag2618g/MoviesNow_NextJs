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
        contentSnapshot: {
            title: {type: String, required: true},
            posterPath: {type: String, default: null},
            backdropPath: {type: String, default: null},
            rating: {type: Number, required: true},
            snapShotUpdateAt: {
                type: Date,
                required: true,
            }
        },
        progress: {
            type: Number,
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
watchHistorySchema.index({ userId: 1, status: 1,  lastWatchedAt: -1 });
watchHistorySchema.index({ userId: 1, lastWatchedAt: -1, _id: -1 });

const WatchHistory = mongoose.models.WatchHistory || mongoose.model("WatchHistory", watchHistorySchema);

export default WatchHistory;