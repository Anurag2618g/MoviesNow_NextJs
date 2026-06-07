import { WATCH_COMPLETED, WATCH_PROGRESS_UPDATED, WATCH_STARTED } from "@/infrastructure/events/events";
import { createConsumer } from "@/infrastructure/events/kafka";
import { executeTrendingDecay } from "@/server/trending/trendingDecay.job";
import { handleTrendingActivity } from "./trending.projection";

const TRENDING_DECAY_INTERVAL = 60 * 60 * 1000; // run decay every hour

export const startTrendingWorker = async () => {
    const consumer = createConsumer('trending-group');
    await consumer.connect();

    await consumer.subscribe({
        topics: [WATCH_STARTED, WATCH_PROGRESS_UPDATED, WATCH_COMPLETED],
        fromBeginning: true,
    });

    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            if (!message.value) return;
            const event = JSON.parse(message.value.toString());

            if (
                topic === WATCH_STARTED ||
                topic === WATCH_PROGRESS_UPDATED ||
                topic === WATCH_COMPLETED
            ) {
                await handleTrendingActivity(event, topic);
            }
        },
    });

    // Schedule the score decay job to run periodically
    setInterval(async () => {
        try {
            await executeTrendingDecay();
            console.log('Trending decay executed');
        } catch (err) {
            console.error('Trending decay job failed:', err);
        }
    }, TRENDING_DECAY_INTERVAL);

    console.log('Trending worker & decay scheduler started');
};
