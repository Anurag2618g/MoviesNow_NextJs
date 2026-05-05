import { WATCH_COMPLETED, WATCH_PROGRESS_UPDATED, WATCH_STARTED } from "@/infrastructure/events/events";
import { consumer } from "@/infrastructure/events/kafka";
import { executeTrendingDecay } from "@/server/trending/trendingDecay.job";
import { handleTrendingActivity } from "./trending.projection";

const TRENDING_INTERVAL = 60 * 60 * 1000;

export const startTrendingWorker = async () => {
    consumer.subscribe({
        topics: [WATCH_STARTED, WATCH_PROGRESS_UPDATED, WATCH_COMPLETED],
        fromBeginning: true,
    });
    consumer.run({
        eachMessage: async({topic, message}) => {
            if (!message.value) return;
            const event = JSON.parse(message.value.toString());
            if (topic === WATCH_STARTED || topic === WATCH_PROGRESS_UPDATED || topic === WATCH_COMPLETED) {
                await handleTrendingActivity(event, topic);
            }
        }
    });

    setInterval(async () => {
        try{
            await executeTrendingDecay();
            console.log('Started decay');
        } catch (err) {
            console.error('Decay job failed', err);
        }
    }, TRENDING_INTERVAL);
    console.log('Trending Worker & Decay Scheduler initialized.');
};