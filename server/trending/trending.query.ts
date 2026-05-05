import { getCache, setCache } from "../cache/redisCache";
import { getContentByIds } from "../content/content.query";
import { Trending } from "./trending.model";

export const getTrending = async(limit = 10) => {
    const cacheKey = `trending:top:${limit}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const items = await Trending.find({}).sort({ score: -1 }).limit(limit).lean();
    if (!items.length) return [];
    const contentIds = items.map(i => i.contentId);
    const contentMap = await getContentByIds(contentIds);

    const formatted = items.map(item => {
        const content = contentMap.get(item.contentId);
        return {
            contentId: item.contentId,
            title: content?.title,
            posterPath: content?.posterPath,
            rating: content?.rating,
            score: item.score
        };
    });

    await setCache(cacheKey, formatted, 300);
    return formatted;
};