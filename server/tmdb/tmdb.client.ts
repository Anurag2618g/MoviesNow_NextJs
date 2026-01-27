import { env } from '../config/env';

export const tmdbFetch = async <T>(
    path: string,
    params: Record<string, string | number> = {}
): Promise<T> => {
    const url = new URL(`${env.TMDB_BASE_URL}${path}`);
    url.searchParams.set('api_key', env.TMDB_API_KEY);
    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, String(value));
    }
    const res = await fetch(url.toString(),{
        next: { revalidate: 0 },
    });
    if (!res.ok) {
        throw new Error(`TMDB error: ${res.status}`);
    }
    return res.json() as Promise<T>; 
};