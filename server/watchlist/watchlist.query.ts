import { getCache, setCache } from "@/infrastructure/cache/redisCache";
import { getContentByIds } from "../content/content.query";
import { connectDB } from "@/infrastructure/db/mongo";
import { WatchListProjection } from "./watchlist.projection.model";

export const getWatchlist = async (userId: string) => {
    const cacheKey = `watchlist:${userId}`;

    const cached = await getCache(cacheKey);
    if (cached) return cached;

    await connectDB();

    const items = await WatchListProjection.find({ userId }).sort({ addedAt: -1 }).lean();
    const contentIds = items.map(i => i.contentId);
    const contentMap = await getContentByIds(contentIds);

    const formatted = items.map(item => {
        const content = contentMap.get(item.contentId);
        return {
            contentId: item.contentId,
            title: content?.title,
            posterPath: content?.posterPath,
            rating: content?.rating,
            addedAt: item.addedAt,
        };
    });

    await setCache(cacheKey, formatted, 60);
    return formatted;
};