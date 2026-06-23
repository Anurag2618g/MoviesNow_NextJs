export async function register() {
    // Only run on the Node.js runtime (not Edge runtime)
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { connectDB } = await import('./infrastructure/db/mongo');
        await connectDB();
    }
}
