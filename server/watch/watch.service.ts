import { connectDB } from "../db/mongo";
import { eventBus } from "../events/eventBus";
import { WATCH_PROGRESS_UPDATED } from "../events/events";
import WatchHistory from "./watch.model";

type UpdateProgressInput = {
    userId: string,
    contentId: string,
    progress: number,
    duration: number,
};

export const updateWatchProgress = async({ userId, contentId, progress, duration }: UpdateProgressInput) => {
    await connectDB();

    if (progress < 0 || duration < 0 || progress > duration) {
        throw new Error("Invalid progress data");
    }
    const status = progress >= duration? "completed" : "in_progress";
    const updatedAt = new Date();

    const doc = await WatchHistory.findOneAndUpdate(
        { userId, contentId},
        {
            $set: {
                progress,
                duration,
                status,
                lastWatchedAt: updatedAt,
            },
        },
        { upsert: true, new: true, }
    );
    
    await eventBus.emit(WATCH_PROGRESS_UPDATED, {
        userId,
        contentId,
        duration,
        progress,
        status,
        updatedAt,
    });

    return {
        contentId: doc.contentId,
        progress: doc.progress,
        duration: doc.duration,
        status: doc.status,
        lastWatchedAt: doc.lastWatchedAt,
    };
};