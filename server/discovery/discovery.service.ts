/* eslint-disable @typescript-eslint/no-explicit-any */
import { Content } from "../content/content.model";
import { ContinueWatching } from "../continueWatching/continueWatching.model";
import { Trending } from "../trending/trending.model";
import { Recommendation } from "./discovery.model";

export const getHomeFeed = async (userId: string) => {
    const [personalized, trending, continueWatching] = await Promise.all([
        Recommendation.findOne({ userId }).lean(),
        Trending.find().sort({ score: -1 }).limit(15).lean(),
        ContinueWatching.find({ userId }).sort({ lastWatchedAt: -1 }).limit(10).lean()
    ]);

    return {
        forYou: await hydrateContent(personalized?.items || []),
        trending: await hydrateContent(trending),
        continueWatching: await hydrateContent(continueWatching),
    };
};

const hydrateContent = async (items: any[] ) => {
    if (!items.length) return [];

    const ids = items.map((item: { contentId: any; }) => item.contentId || item);

    const metadata = await Content.find({ contentId: { $in: ids } }).lean();

    return ids.map((id: any) => metadata.find(m => m.contentId === id)).filter(Boolean);
};