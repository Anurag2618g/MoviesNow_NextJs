import { getCache, setCache } from "@/infrastructure/cache/redisCache";
import { getContentByIds } from "../content/content.query";
import { ContinueWatching } from "./continueWatching.model";
export interface ContinueWatchingItems {
    contentId: string;
    title: string;
    posterPath: string;
    rating: number;
    progress: number;
    duration: number;
    lastWatchedAt: Date;
}
export const getContinueWatching = async(userId: string, limit = 10): Promise<ContinueWatchingItems[]> => {
    const cacheKey = `continue:${userId}`;
    const cached = await getCache<ContinueWatchingItems[]>(cacheKey);
    if (cached) return cached;

    const items = await ContinueWatching.find({ userId })
        .sort({ lastWatchedAt: -1 })
        .limit(limit)
        .lean();
    const contentIds = items.map(i => i.contentId);
    const contentMap = await getContentByIds(contentIds);

    const formatted: ContinueWatchingItems[] = items.map(item => {
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