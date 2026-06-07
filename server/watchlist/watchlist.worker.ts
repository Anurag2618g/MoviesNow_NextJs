import { WATCHLIST_ITEM_ADDED, WATCHLIST_ITEM_REMOVED } from "@/infrastructure/events/events";
import { createConsumer } from "@/infrastructure/events/kafka";
import { handleWatchlistItemAdded, handleWatchlistItemRemoved } from "./watchlist.projection";

export const startWatchlistWorker = async () => {
    const consumer = createConsumer('watchlist-group');
    await consumer.connect();

    await consumer.subscribe({
        topics: [WATCHLIST_ITEM_ADDED, WATCHLIST_ITEM_REMOVED],
        fromBeginning: true,
    });

    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            if (!message.value) return;
            const event = JSON.parse(message.value.toString());

            switch (topic) {
                case WATCHLIST_ITEM_ADDED:
                    await handleWatchlistItemAdded(event);
                    break;
                case WATCHLIST_ITEM_REMOVED:
                    await handleWatchlistItemRemoved(event);
                    break;
                default:
                    console.warn(`Unhandled topic in Watchlist: ${topic}`);
            }
        },
    });
};
