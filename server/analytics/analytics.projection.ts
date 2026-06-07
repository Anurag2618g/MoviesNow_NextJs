import { Analytics } from "./analytics.model";
import { Content } from "../content/content.model";

// These handlers are called by the analytics worker (Kafka consumer)
// Each function receives a parsed event payload and updates the Analytics read model

export const handleWatchStarted = async (event: { userId: string }) => {
    await Analytics.findOneAndUpdate(
        { userId: event.userId },
        { $inc: { totalStarted: 1 } },
        { upsert: true }
    );
};

export const handleWatchProgressUpdated = async (event: { userId: string; progress: number }) => {
    await Analytics.findOneAndUpdate(
        { userId: event.userId },
        { $inc: { totalWatchTime: event.progress } },
        { upsert: true },
    );
};

export const handleWatchCompleted = async (event: { userId: string; contentId: string }) => {
    // Look up the content to get its genres
    const content = await Content.findOne({ contentId: event.contentId });

    const genreUpdates: Record<string, number> = {};
    if (content?.genres) {
        for (const genre of content.genres) {
            genreUpdates[`genreCounts.${genre}`] = 1;
        }
    }

    await Analytics.findOneAndUpdate(
        { userId: event.userId },
        { $inc: { totalCompleted: 1, ...genreUpdates } },
        { upsert: true }
    );
};
