import { Trending } from "./trending.model";

export const executeTrendingDecay = async() => {  
    const DECAY_FACTOR = 0.5;
    await Trending.updateMany(
        {},
        [
            {
                $set: {
                    score: { $max: [{ $multiply: ['$score', DECAY_FACTOR] }, 0] }
                }
            }
        ]
    );
};