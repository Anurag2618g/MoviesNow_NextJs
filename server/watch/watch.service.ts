import { deleteCache } from "../cache/redisCache";
import { connectDB } from "../db/mongo";
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

    const doc = await WatchHistory.findOneAndUpdate(
        { userId, contentId},
        {
            $set: {
                progress,
                duration,
                status,
                lastWatchedAt: new Date(),
            },
        },
        {
            upsert: true,
            new: true,
        }
    );
    await deleteCache(`continue:${userId}`);

    return {
        contentId: doc.contentId,
        progress: doc.progress,
        duration: doc.duration,
        status: doc.status,
        lastWatchedAt: doc.lastWatchedAt,
    };
};