import redis from "./redis";

export const getCache = async <T>(key: string): Promise<T | null> => {
    const value = await redis.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
};

export const setCache = async (key: string, value: unknown, ttls: number) => {
    await redis.set(
        key,
        JSON.stringify(value),
        'EX',
        ttls,
    );
};

export const deleteCache = async (key: string) => {
    await redis.del(key);
};