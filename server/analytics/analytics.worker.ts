import { WATCH_COMPLETED } from "@/infrastructure/events/events"
import { consumer } from "@/infrastructure/events/kafka"

export const startAnalyticsWorker = async () => {
    await consumer.subscribe({topic: WATCH_COMPLETED, fromBeginning: true});

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const event = JSON.parse(message.value?.toString());
            
        }
    });
}