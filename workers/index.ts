/**
 * Worker Process Entry Point
 *
 * This runs all Kafka consumers as a single long-running Node process.
 * Start it separately from the Next.js app:
 *   npx ts-node -r tsconfig-paths/register workers/index.ts
 *
 * Why separate from Next.js?
 * Next.js API routes are serverless — they spin up per request and shut down.
 * Kafka consumers must stay alive continuously to receive messages.
 * If you ran them inside a route handler they would disconnect on every cold start.
 */

import { connectKafka } from '../infrastructure/events/kafka';
import { connectDB } from '../infrastructure/db/mongo';
import { startContinueWatchingWorker } from '../server/continueWatching/continueWatching.worker';
import { startTrendingWorker } from '../server/trending/trending.worker';
import { startAnalyticsWorker } from '../server/analytics/analytics.worker';
import { startDiscoveryWorker } from '../server/discovery/discovery.worker';
import { startWatchlistWorker } from '../server/watchlist/watchlist.worker';

const start = async () => {
    console.log('[Workers] Connecting to MongoDB...');
    await connectDB();

    console.log('[Workers] Connecting to Kafka...');
    await connectKafka();

    console.log('[Workers] Starting all consumers...');

    // Each worker creates its own Kafka consumer with a unique group ID
    // so they can all subscribe independently without conflicting
    await Promise.all([
        startContinueWatchingWorker(),
        startTrendingWorker(),
        startAnalyticsWorker(),
        startDiscoveryWorker(),
        startWatchlistWorker(),
    ]);

    console.log('[Workers] All workers running.');
};

start().catch((err) => {
    console.error('[Workers] Startup failed:', err);
    process.exit(1);
});
