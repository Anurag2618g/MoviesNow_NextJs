import { connectDB } from "@/infrastructure/db/mongo";
import { getMovieById } from "../tmdb/movies";
import { Content } from "./content.model";

export const ensureContentExists = async (contentId: string, type: 'movie' | 'tv') => {
    await connectDB();

    // Check first — avoids a TMDB API call on every request for known content
    const existing = await Content.findOne({ contentId });
    if (existing) return existing;

    // Not in DB — fetch from TMDB
    const movie = await getMovieById(Number(contentId));

    // Use findOneAndUpdate with upsert instead of create.
    // This is atomic — if two requests race, only one insert happens.
    // The second request just gets the existing document back.
    const doc = await Content.findOneAndUpdate(
        { contentId },
        {
            $setOnInsert: {
                contentId,
                type,
                title: movie.title,
                posterPath: movie.posterPath,
                backdropPath: movie.backdropPath,
                rating: movie.rating,
                genres: movie.genreIds ?? [],
                releasedAt: movie.releaseDate,
                snapshotUpdatedAt: new Date(),
            },
        },
        { upsert: true, new: true }
    );

    return doc;
};