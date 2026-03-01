import { eventBus } from "../events/eventBus";
import { deleteCache } from "../cache/redisCache";
import { WATCH_PROGRESS_UPDATED } from "../events/events";
// import { getMovieById } from "../tmdb/movies";
import { ContinueWatching } from "../watch/watch.model";

eventBus.on(WATCH_PROGRESS_UPDATED, async (event) => {
    const { userId, contentId, progress, duration, status, updatedAt } = event;
    // const movie = await getMovieById(Number(contentId));

    if (status === 'completed') {
        await ContinueWatching.deleteOne({ userId, contentId });
    }
    else {
        await ContinueWatching.findOneAndUpdate(
            { userId, contentId },
            {
                $set: {
                    progress,
                    duration,
                    lastWatchedAt: updatedAt,
                },
            },
            { upsert: true }
        );
    }
    await deleteCache(`continue:${userId}`);
});