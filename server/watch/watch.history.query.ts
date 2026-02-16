import { getCache, setCache } from "../cache/redisCache";
import { connectDB } from "../db/mongo";
import { getMovieById } from "../tmdb/movies";
import { EnrichedHistoryItem } from "../tmdb/types";
import WatchHistory from "./watch.model";

type Cursor = {
    lastWatchedAt: string,
    id: string
};

type HistoryQuery = {
    userId: string,
    limit: number,
    cursor?: Cursor,
};

export const getWatchHistory = async({ userId, limit, cursor }: HistoryQuery): Promise<{
    items: EnrichedHistoryItem[];
    nextCursor: Cursor | null;
}> => {
    await connectDB();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { userId };
    
    if (cursor) {
        query.$or = [
            { lastWatchedAt: { $lt: new Date(cursor.lastWatchedAt) } },
            { 
                lastWatchedAt: new Date(cursor.lastWatchedAt),
                _id: { $lt: cursor.id}
            }
        ];
    }

    const items = await WatchHistory.find(query)
        .sort({ lastWatchedAt: -1, _id: -1 })
        .limit(limit)
        .select({
            contentId: 1,
            progress: 1,
            duration: 1,
            status: 1,
            lastWatchedAt: 1,
        })
        .lean();

    const enriched: EnrichedHistoryItem[] = await Promise.all(
        items.map(async (item) => {
            const movie = await getMovieById(Number(item.contentId));
            return {
                content: movie,
                progress: item.progress,
                duration: item.duration,
                status: item.status,
                lastWatchedAt: item.lastWatchedAt.toISOString(),
            }
        })
    );
    
    const nextCursor = items.length === limit? {
        lastWatchedAt: items[items.length-1].lastWatchedAt.toISOString(),
        id: items[items.length-1]._id.toString(),
    } : null;
    
    return { items: enriched, nextCursor };
};

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