/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from '../config/env';

export const tmdbFetch = async <T>(
    path: string,
    params: Record<string, string | number> = {}
): Promise<T> => {
    const url = new URL(`${env.TMDB_BASE_URL}${path}`);
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${env.TMDB_API_KEY}`
        },
        next: { revalidate: 0 },
    };
    // url.searchParams.set('api_key', env.TMDB_API_KEY);
    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, String(value));
    }
    try {
        const res = await fetch(url.toString(),options);
        return res.json() as Promise<T>; 
    }
    catch (err: any) {
        throw new Error(`TMDB error: ${err.message}`);
    }
};
