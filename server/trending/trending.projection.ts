/* eslint-disable @typescript-eslint/no-explicit-any */
import { WATCH_COMPLETED, WATCH_PROGRESS_UPDATED, WATCH_STARTED } from "@/infrastructure/events/events";
import { Trending } from "./trending.model";

const SIGNAL_WEIGHTS = {
    [WATCH_COMPLETED]: 5,
    [WATCH_PROGRESS_UPDATED]: 0.5,
    [WATCH_STARTED]: 1
}

export const handleTrendingActivity = async(event: any, eventType: keyof typeof SIGNAL_WEIGHTS) => {
    const weight = SIGNAL_WEIGHTS[eventType] || 1;
    await Trending.findOneAndUpdate(
        { contentId: event.contentId },
        {
            $inc: { score: weight },
            $set: { lastActivityAt: event.UpdatedAt || new Date() },
        },
        { upsert: true },
    );
};