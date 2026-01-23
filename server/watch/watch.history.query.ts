import { connectDB } from "../db/mongo";
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

export const getWatchHistory = async({ userId, limit, cursor }: HistoryQuery) => {
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
    
    const nextCursor = items.length === limit? {
        lastWactedAt: items[items.length-1].lastWatchedAt.toISOString(),
        _id: items[items.length-1]._id.toString(),
    } : null;
    
    return { items, nextCursor };
};