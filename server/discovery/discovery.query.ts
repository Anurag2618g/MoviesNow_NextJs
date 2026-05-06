import { Recommendation } from "./discovery.model";

export const getPersonalizedItems = async (userId: string) => {
    return await Recommendation.findOne({ userId }).lean();
};