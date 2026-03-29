import { WATCH_COMPLETED, WATCH_STARTED } from "@/infrastructure/events/events";
import { eventBus } from "../events/eventBus";
import { Analytics } from "./analytics.model";
import { WATCH_PROGRESS_UPDATED } from "../events/events";
import { Content } from "../content/content.model";

eventBus.on(WATCH_STARTED, async (event) => {
    await Analytics.findOneAndUpdate(
        { userId: event.userId },
        { $inc: { totalStarted: 1 } },
        { upsert: true }
    );
});

eventBus.on(WATCH_PROGRESS_UPDATED, async( event) => {
    await Analytics.findOneAndUpdate(
        { userId: event.userId },
        { $inc: { totalWatchTime: event.progress } },
        { upsert: true },
    );
});

eventBus.on(WATCH_COMPLETED, async (event) => {
    const content = await Content.findOne({ ContentId: event.ContentId });
    const genreUpdates: Record<string, number> = {};

    if (content?.genres) {
      for (const genre of content.genres) {
        genreUpdates[`genreCounts.${genre}`] = 1;
      }
    }
    await Analytics.findOneAndUpdate(
      { UserId: event.userId },
      { $inc: { totalCompleted: 1, ...genreUpdates } },
      { upsert: true }
    );
}); 