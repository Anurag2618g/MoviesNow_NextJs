import { Trending } from "./trending.model";

export const TrendingDecay = async() => {
    
    const DECAY_FACTOR = 0.5;

    await Trending.updateMany(
        {},
        [
            {
                $set: {
                    score: { $multiply: ['score', DECAY_FACTOR] }
                }
            }
        ]
    );
};