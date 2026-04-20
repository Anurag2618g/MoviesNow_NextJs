/* eslint-disable @typescript-eslint/no-explicit-any */
import { producer } from "./kafka";

class KafkaEventBus {
    async emit (topic: string, payload: any) {
        await producer.send({
            topic,
            messages: [
                {
                    value: JSON.stringify(payload),
                    key: payload.userId
                },
            ],
        });
    }
}
export const eventBus = new KafkaEventBus();