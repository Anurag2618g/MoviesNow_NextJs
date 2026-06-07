import { WATCH_COMPLETED, WATCH_PROGRESS_UPDATED, WATCH_STARTED } from "@/infrastructure/events/events";
import { createConsumer } from "@/infrastructure/events/kafka";
import { handleWatchCompleted, handleWatchProgressUpdated, handleWatchStarted } from "./analytics.projection";

export const startAnalyticsWorker = async () => {
    const consumer = createConsumer('analytics-group');
    await consumer.connect();

    await consumer.subscribe({
        topics: [WATCH_STARTED, WATCH_PROGRESS_UPDATED, WATCH_COMPLETED],
        fromBeginning: true,
    });

    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            if (!message.value) return;
            const event = JSON.parse(message.value.toString());

            switch (topic) {
                case WATCH_STARTED:
                    await handleWatchStarted(event);
                    break;
                case WATCH_PROGRESS_UPDATED:
                    await handleWatchProgressUpdated(event);
                    break;
                case WATCH_COMPLETED:
                    await handleWatchCompleted(event);
                    break;
                default:
                    console.warn(`Unhandled topic in Analytics: ${topic}`);
            }
        },
    });
};
