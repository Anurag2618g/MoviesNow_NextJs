import { ensureContentExists } from "../content/content.service";
import { connectDB } from "../db/mongo";
import { eventBus } from "../events/eventBus";
import { WatchList } from "./watchlist.model";

export const addToWatchlist = async (userId: string, contentId: string) => {
    await connectDB();

    await ensureContentExists(contentId, 'movie');

    await WatchList.updateOne(
        { userId, contentId },
        { $set: { addedAt: new Date() } },
        { upsert: true },
    );

    await eventBus.emit('WATCHLIST_ITEM_ADDED', {
        userId,
        contentId,
        addedAt: new Date(),
    });
};

export const removeFromWatchlist = async (userId: string, contentId: string) => {
    await connectDB();

    await WatchList.deleteOne({ userId, contentId });
    
    await eventBus.emit('WATCHLIST_ITEM_REMOVED', {
        userId,
        contentId
    });
};