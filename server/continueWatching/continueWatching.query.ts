import { getCache, setCache } from "../cache/redisCache";
import { connectDB } from "../db/mongo";
import { WatchHistory } from "../watch/watch.model";

export const getContinueWatching = async(userId: string, limit = 10) => {
    const cacheKey = `continue:${userId}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    await connectDB();

    const items = await WatchHistory.find({ userId, status: 'in_progress'})
        .sort({ lastWatchedAt: -1 })
        .limit(limit)
        .select({
            contentSnapshot: 1, 
            progress: 1,
            duration: 1,
            lastWatchedAt: 1,
            _id: 0,
        })
        .lean();
        
    const formatted = items.map((item) => ({
        content: item.contentSnapshot,
        progress: item.progress,
        duration: item.duration,
        lastWatchedAt: item.lastWatchedAt.toISOString(),
    }));

    await setCache(cacheKey, formatted, 30);
    return formatted;
};