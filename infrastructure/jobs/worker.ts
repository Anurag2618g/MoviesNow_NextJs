import { connectDB } from "@/infrastructure/db/mongo";
import { TrendingDecay } from "@/server/trending/trendingDecay.job";

const TRENDING_INTERVAL = 60 * 60 * 1000;

export const startWorker = async () => {
    await connectDB();

    console.log('Background worker started')

    setInterval(async () => {
        try{
            await TrendingDecay();
            console.log('Started decay');
        } catch (err) {
            console.error('Decay job failed', err);
        }
    }, TRENDING_INTERVAL);
};