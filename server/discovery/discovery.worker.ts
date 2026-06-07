import { WATCH_COMPLETED } from "@/infrastructure/events/events";
import { createConsumer } from "@/infrastructure/events/kafka";
import { calculateRecommendations } from "./discovery.projection";

export const startDiscoveryWorker = async () => {
    const consumer = createConsumer('discovery-group');
    await consumer.connect();

    await consumer.subscribe({
        topic: WATCH_COMPLETED,
        fromBeginning: true,
    });

    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            if (!message.value) return;
            const event = JSON.parse(message.value.toString());

            if (topic === WATCH_COMPLETED) {
                console.log(`Recalculating recommendations for user: ${event.userId}`);
                await calculateRecommendations(event);
            }
        },
    });
};
