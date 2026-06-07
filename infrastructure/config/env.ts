export const env = {
    MONGO_URI: process.env.MONGO_URI!,
    USER_EMAIL: process.env.EMAIL!,
    USER_PASSWORD: process.env.PASSWORD!,
    JWT_SECRET: process.env.SECRET!,
    REDIS_HOST: process.env.REDIS_HOST!,
    REDIS_PORT: Number(process.env.REDIS_PORT ?? 6379),
    REDIS_PASSWORD: process.env.REDIS_PASSWORD!,
    TMDB_API_KEY: process.env.TMDB_API_KEY!,
    TMDB_BASE_URL: process.env.TMDB_BASE_URL!,
};
