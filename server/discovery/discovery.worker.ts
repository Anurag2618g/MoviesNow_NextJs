import { WATCH_COMPLETED } from "@/infrastructure/events/events";
import { consumer } from "@/infrastructure/events/kafka";
import { calculateRecommendations } from "./discovery.projection";

export const startDiscoveryWorker = async () => {
    await consumer.subscribe({
        topic: WATCH_COMPLETED,
        fromBeginning: true,
    });
    await consumer.run({
        eachMessage: async ({topic, message}) => {
            if (!message.value) return;
            const event = JSON.parse(message.value.toString());
            if (topic === WATCH_COMPLETED) {
                console.log(`Recalculating recommendation for user: ${event.userId}`);
                await calculateRecommendations(event);
            }
        },
    });
};