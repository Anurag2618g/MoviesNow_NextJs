import { ensureContentExists } from "../content/content.service";
import { connectDB } from "@/infrastructure/db/mongo";
import { publishEvent } from "@/infrastructure/events/producer";
import { WATCHLIST_ITEM_ADDED, WATCHLIST_ITEM_REMOVED } from "@/infrastructure/events/events";
import { WatchList } from "./watchlist.model";

export const addToWatchlist = async (userId: string, contentId: string) => {
    await connectDB();

    // Ensure the content snapshot exists in our DB before referencing it
    await ensureContentExists(contentId, 'movie');

    await WatchList.updateOne(
        { userId, contentId },
        { $set: { addedAt: new Date() } },
        { upsert: true },
    );

    await publishEvent(WATCHLIST_ITEM_ADDED, {
        userId,
        contentId,
        addedAt: new Date().toISOString(),
    });
};

export const removeFromWatchlist = async (userId: string, contentId: string) => {
    await connectDB();

    await WatchList.deleteOne({ userId, contentId });

    await publishEvent(WATCHLIST_ITEM_REMOVED, {
        userId,
        contentId,
    });
};
