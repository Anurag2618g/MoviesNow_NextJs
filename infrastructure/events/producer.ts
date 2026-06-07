import { producer } from './kafka';

/**
 * Kafka Producer — publishes domain events to Kafka topics.
 *
 * IMPORTANT: publishEvent is fire-and-forget with graceful degradation.
 * If Kafka is not running (e.g. local dev without a broker), the event
 * is logged but the calling service does NOT fail.
 *
 * This means:
 * - DB writes always succeed regardless of Kafka status
 * - Projections (continueWatching, trending, analytics) won't update without Kafka
 * - To get full functionality locally, run Kafka via Docker:
 *     docker run -p 9092:9092 apache/kafka:latest
 */

let connected = false;
let kafkaAvailable = true; // optimistic — assume Kafka is up until proven otherwise

async function ensureConnected(): Promise<boolean> {
    if (!kafkaAvailable) return false;
    if (connected) return true;

    try {
        await producer.connect();
        connected = true;
        console.log('[Kafka] Producer connected');
        return true;
    } catch (err) {
        kafkaAvailable = false;
        console.warn('[Kafka] Producer unavailable — events will be skipped until Kafka is running:', err instanceof Error ? err.message : err);
        return false;
    }
}

export async function publishEvent(
    topic: string,
    payload: Record<string, unknown>
): Promise<void> {
    const ok = await ensureConnected();
    if (!ok) {
        // Kafka is down — log and continue. DB write already succeeded.
        console.warn(`[Kafka] Skipping event "${topic}" for user "${payload.userId ?? 'unknown'}" — Kafka unavailable`);
        return;
    }

    try {
        await producer.send({
            topic,
            messages: [
                {
                    value: JSON.stringify(payload),
                    key: typeof payload.userId === 'string' ? payload.userId : undefined,
                },
            ],
        });
    } catch (err) {
        // Don't crash the request — just log
        console.error(`[Kafka] Failed to publish event "${topic}":`, err instanceof Error ? err.message : err);
    }
}
