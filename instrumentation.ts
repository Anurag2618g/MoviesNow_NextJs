/**
 * Next.js Instrumentation File
 *
 * This runs ONCE when the Next.js server starts, before any request is handled.
 * It's the correct place to establish long-lived connections like MongoDB.
 *
 * Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
    // Only run on the Node.js runtime (not Edge runtime)
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { connectDB } = await import('./infrastructure/db/mongo');
        await connectDB();
    }
}
