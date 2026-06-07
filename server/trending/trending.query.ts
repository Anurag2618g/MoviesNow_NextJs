import { getCache, setCache } from "@/infrastructure/cache/redisCache";
import { getContentByIds } from "../content/content.query";
import { Trending } from "./trending.model";

export interface TrendingItems {
    contentId: string;
    title: string;
    posterPath: string;
    rating: number;
    score: number;
}

export const getTrending = async(limit = 10):  Promise<TrendingItems[]> => {
    const cacheKey = `trending:top:${limit}`;
    const cached = await getCache<TrendingItems[]>(cacheKey);
    if (cached) return cached;

    const items = await Trending.find({}).sort({ score: -1 }).limit(limit).lean();
    if (!items.length) return [];
    const contentIds = items.map(i => i.contentId);
    const contentMap = await getContentByIds(contentIds);

    const formatted: TrendingItems[] = items.map(item => {
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