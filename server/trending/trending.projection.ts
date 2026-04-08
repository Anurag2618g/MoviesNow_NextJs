import { eventBus } from "../events/eventBus";
import { Trending } from "./trending.model";

eventBus.on('WATCH_PROGRESS_UPDATED', async(event) => {
    const { contentId, updatedAt } = event;
    await Trending.findOneAndUpdate(
        { contentId },
        {
            $inc: { score: 1 },
            $set: { updatedAt },
        },
        { upsert: true },
    );
});