import { getCache, setCache } from "../cache/redisCache";
import { getContentByIds } from "../content/content.query";
import { WatchListProjection } from "./watchlist.projection.model";

export const getWatchlist = async (userId: string) => {
    const cachekey = `watchlist:${userId}`;

    const cached = await getCache(cachekey);
    if (cached) {
        return cached;
    }

    const items = await WatchListProjection.find({ userId: userId }).sort({ addedAt:-1 }).lean();

    const contentIds = items.map(i => i.contentId);
    const contentMap = await getContentByIds(contentIds);

    const formatted = items.map(item => {
        const content = contentMap.get(item.contentId);

        return {
            contentId: item.contentId,
            title: content?.title,
            posterPath: content?.posterPath,
            rating: content?.rating,
            addedAt: item.addedAt
        };
    });

    await setCache(cachekey, formatted, 60);

    return formatted;
};