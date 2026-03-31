import { deleteCache } from "../cache/redisCache";
import { eventBus } from "../events/eventBus";
import { WatchListProjection } from "./watchlist.projection.model";

eventBus.on('WATCHLIST_ITEM_ADDED', async (event) => {
    const { userId, contentId, addedAt } = event;

    await WatchListProjection.findOneAndUpdate(
        { userId, contentId },
        { $set: { addedAt } },
        { upsert: true },
    );

    await deleteCache(`watchlist:${userId}`);
});

eventBus.on('WATCHLIST_ITEM_REMOVED', async (event) => {
    const { userId, contentId } = event;

    await WatchListProjection.deleteOne({ userId, contentId });

    await deleteCache(`watchlist:${userId}`);
});