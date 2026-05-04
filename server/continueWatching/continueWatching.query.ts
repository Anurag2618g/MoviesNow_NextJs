import { getCache, setCache } from "../cache/redisCache";
import { getContentByIds } from "../content/content.query";
import { connectDB } from "@/infrastructure/db/mongo";
import { ContinueWatching } from "./continueWatching.model";

export const getContinueWatching = async(userId: string, limit = 10) => {
    const cacheKey = `continue:${userId}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;
    await connectDB();

    const items = await ContinueWatching.find({ userId })
        .sort({ lastWatchedAt: -1 })
        .limit(limit)
        .lean();
    const contentIds = items.map(i => i.contentId);
    const contentMap = await getContentByIds(contentIds);

    const formatted = items.map(item => {
        const content = contentMap.get(item.contentId);
        return {
            contentId: item.contentId,
            title: content?.title,
            posterPath: content?.posterPath,
            rating: content?.rating,
            progress: item.progress,
            duration: item.duration,
            lastWatchedAt: item.lastWatchedAt.toISOString(),
        };
    });

    await setCache(cacheKey, formatted, 30);
    return formatted;
};