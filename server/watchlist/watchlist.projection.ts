import { deleteCache } from "@/infrastructure/cache/redisCache";
import { WatchListProjection } from "./watchlist.projection.model";

// These handlers are called by the watchlist worker (Kafka consumer)
// Each function receives a parsed event payload and updates the WatchList read model

export const handleWatchlistItemAdded = async (event: { userId: string; contentId: string; addedAt: string }) => {
    await WatchListProjection.findOneAndUpdate(
        { userId: event.userId, contentId: event.contentId },
        { $set: { addedAt: new Date(event.addedAt) } },
        { upsert: true },
    );

    await deleteCache(`watchlist:${event.userId}`);
};

export const handleWatchlistItemRemoved = async (event: { userId: string; contentId: string }) => {
    await WatchListProjection.deleteOne({
        userId: event.userId,
        contentId: event.contentId,
    });

    await deleteCache(`watchlist:${event.userId}`);
};
