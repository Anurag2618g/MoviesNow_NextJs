// import { connectDB } from "@/server/db/mongo";
import { TrendingDecay } from "@/server/discovery/trendingDecay.job";

const TRENDING_INTERVAL = 60 * 60 * 1000;

export const startWorker = async () => {

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