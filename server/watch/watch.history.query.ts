import { connectDB } from "../db/mongo";
import WatchHistory from "./watch.model";

type HistoryQuery = {
    userId: string,
    limit: number,
    cursor?: string,
};

export const getHistory = async({ userId, limit, cursor }: HistoryQuery) => {
    await connectDB();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { userId };
    
    if (cursor) {
        query.lastWatchedAt = { $lt: new Date(cursor)};
    }

    const items = await WatchHistory.find(query)
        .sort({lastWatchedAt: -1})
        .limit(limit)
        .select({
            contentId: 1,
            progress: 1,
            duration: 1,
            status: 1,
            lastWatchedAt: 1,
            _id: 0
        })
        .lean();
    
    const nextCursor = items.length === limit? 
        items[items.length-1].lastWatchedAt.toISOString() : null;
    
    return { items, nextCursor };
};