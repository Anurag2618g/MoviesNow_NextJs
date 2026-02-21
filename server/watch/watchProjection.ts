import { eventBus } from "../events/eventBus";
import { WATCH_PROGRESS_UPDATED } from "../events/events";
import { getMovieById } from "../tmdb/movies";
import WatchHistory from "./watch.model";

eventBus.on(WATCH_PROGRESS_UPDATED, async (event) => {
    const movie = await getMovieById(Number(event.contentId));

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
});