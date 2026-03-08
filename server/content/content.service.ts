import { connectDB } from "../db/mongo";
import { getMovieById } from "../tmdb/movies";
import { Content } from "./content.model";

export const ensureContentExists = async ( contentId: string, type: 'movie' | 'tv' ) => {
    await connectDB();
    const existing = await Content.findOne({ contentId });
    if (existing) {
        return existing;
    }

    const movie = await getMovieById(Number(contentId));
    const doc = await Content.create({
        contentId,
        type,
        title: movie.title,
        posterPath: movie.posterPath,
        backdropPath: movie.backdropPath,
        rating: movie.rating,
        genres: movie.genreIds?? [],
        releasedAt: movie.releaseDate,
        snapshotUpdatedAt: new Date(),
    });
    
    return doc;
};