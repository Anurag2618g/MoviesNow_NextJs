/* eslint-disable @typescript-eslint/no-explicit-any */
import { Content } from "../content/content.model";
import { getContinueWatching } from "../continueWatching/continueWatching.query";
import { getTrending } from "../trending/trending.query";
import { getPersonalizedItems } from "./discovery.query";

export const getHomeFeed = async (userId: string) => {
    const [personalized, trending, continueWatching] = await Promise.all([
        getPersonalizedItems(userId),
        getTrending(15),
        getContinueWatching(userId, 10)
    ]);
    const forYouItems = personalized?.items?.length > 0
        ? personalized?.items
        : trending.slice(0, 10);
    return {
        forYou: await hydrateContent(forYouItems),
        trending,
        continueWatching
    };
};

const hydrateContent = async (items: any[] ) => {
    if (!items.length) return [];
    const ids = items.map(item => item.contentId || item);
    const metadata = await Content.find({contentId: { $in: ids }}).lean();
    return items.map(item => {
        const id = item.contentId || item;
        const meta = metadata.find(m => m.contentId === id);
        if (!meta) return null;
        return {
            ...meta,
            reason: item.reason || null
        };
    }).filter(Boolean);
};