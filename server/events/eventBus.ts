/* eslint-disable @typescript-eslint/no-explicit-any */
type EventHandler<T = any> = (payload: T) => Promise<void> | void;

class EventBus {
    private handlers: Map<string, EventHandler[]> = new Map();

    on(eventName: string, handler: EventHandler) {
        const existing = this.handlers.get(eventName) || [];
        existing.push(handler);
        this.handlers.set(eventName, existing);
    }

    async emit<T> (eventName: string, payload: T) {
        const handlers = this.handlers.get(eventName) || [];
        for (const handler of handlers) {
            await handler(payload);
        }
    }
};

export const eventBus = new EventBus();