import Redis from 'ioredis';
import { env } from '../config/env';

const redis = new Redis(env.REDIS_URL, {
    tls: {},
    maxRetriesPerRequest: 3,
});

redis.on('error', (err) => {
    console.log('Redis error:', err);
});

export default redis;