import { eventBus } from "../events/eventBus";
import { deleteCache } from "../cache/redisCache";
import { WATCH_PROGRESS_UPDATED } from "../events/events";
import { getMovieById } from "../tmdb/movies";
import WatchHistory from "../watch/watch.model";

eventBus.on(WATCH_PROGRESS_UPDATED, async (event) => {
    const movie = await getMovieById(Number(event.contentId));

    if (event.status === 'completed') {
        await WatchHistory.deleteOne({ event.userId, event.contentID })
    }
    await WatchHistory.findOneAndUpdate(
        { userId: event.userId, contentID: event.contentId },
        {
            contentSnapshot: {
                title: movie.title,
                posterPath: movie.posterPath,
                backdropPath: movie.backdropPath,
                rating: movie.rating,
                snapshotUpdatedAt: new Date(),
            },
        },
    );
    await deleteCache(`continue:${event.userId}`);
});