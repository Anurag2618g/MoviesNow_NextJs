import { getCache, setCache } from "../cache/redisCache";
import { tmdbFetch } from "./tmdb.client";
import { MovieDetails, TmdbListResponse, TmdbMovie, TmdbMovieResponse } from "./types";

export const getTrendingMovies = async () => {
    const cacheKey = 'tmdb:movies:trending';
    const cached = await getCache<TmdbListResponse<TmdbMovie>>(cacheKey);
    if (cached) {
        return cached;
    }

    const data = await tmdbFetch<TmdbListResponse<TmdbMovie>>('trending/movie/week');

    setCache(cacheKey, data, 60*60);
    return data;
};

export const getMovieById = async (tmdbId: number) => {
    const cacheKey = `tmdb:movie:${tmdbId}`;
    const cached = await getCache<MovieDetails>(cacheKey);
    if (cached) {
        return cached;
    }

    const data = await tmdbFetch<TmdbMovieResponse>(`movie/${tmdbId}`);

    const movie: MovieDetails = {
        id: data.id,
        title: data.title,
        overview: data.overview,
        posterPath: data.poster_path,
        backdropPath: data.backdrop_path,
        releaseDate: data.release_date,
        rating: data.vote_average,
        voteCount: data.vote_count,
    };

    setCache(cacheKey, movie, 60 * 60 * 24);
    return movie;
};