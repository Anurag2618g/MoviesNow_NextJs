import { getCache, setCache } from "../cache/redisCache";
import { tmdbFetch } from "./tmdb.client";
import { TmdbListResponse, TmdbMovie } from "./types";

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