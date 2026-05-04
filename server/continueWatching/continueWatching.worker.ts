import { WATCH_COMPLETED, WATCH_PROGRESS_UPDATED, WATCH_STARTED } from "@/infrastructure/events/events";
import { consumer } from "@/infrastructure/events/kafka";
import * as Handlers from "./continueWatching.projection";

export const startContinueWatchingWorker = async () => {
    await consumer.subscribe({
        topics: [WATCH_STARTED, WATCH_PROGRESS_UPDATED, WATCH_COMPLETED],
        fromBeginning: true
    });
    await consumer.run({
        eachMessage: async ({topic, message}) => {
            if (!message.value) return;
            const event = JSON.parse(message.value.toString());
            switch (topic) {
                case WATCH_STARTED:
                case WATCH_PROGRESS_UPDATED:
                    await Handlers.handleWatchProgress(event);
                    break;
                case WATCH_COMPLETED:
                    await Handlers.handleWatchCompleted(event);
                    break;
                default:
                    console.warn(`Unhandled topic in ContinueWatching: ${topic}`);
            }
        }
    });
};