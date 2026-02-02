import { getCache, setCache } from "../cache/redisCache";
import { connectDB } from "../db/mongo";
import WatchHistory from "./watch.model";

export const getContinueWatching = async(userId: string, limit = 10) => {
    const cacheKey = `continue:${userId}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cached = await getCache<any[]>(cacheKey);
    if (cached) return cached;

    await connectDB();

    const result = WatchHistory.find({ userId, status: 'in_progress'})
        .sort({ lastWatchedAt: -1 })
        .limit(limit)
        .select({
            contentId: 1, 
            progress: 1,
            duration: 1,
            lastWatchedAt: 1,
            _id: 0,
        })
        .lean();
    await setCache(cacheKey, result, 30);
    return result;
};