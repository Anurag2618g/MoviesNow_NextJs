import Redis from 'ioredis';
import { env } from '@/infrastructure/config/env';

/**
 * ioredis client — connects to RedisLabs cloud instance.
 *
 * lazyConnect: true — does NOT connect on import, only on first command.
 * No tls — this RedisLabs instance uses a plain (non-TLS) connection on port 18761.
 * If you ever switch to a TLS port (6380), add: tls: {}
 */
const redis = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    enableReadyCheck: false,
});

redis.on('connect', () => console.log('[Redis] Connected'));
redis.on('error', (err) => console.error('[Redis] Error:', err.message));

export default redis;
