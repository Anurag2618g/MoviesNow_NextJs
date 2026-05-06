/* eslint-disable @typescript-eslint/no-explicit-any */
import { Analytics } from "../analytics/analytics.model";
import { Content } from "../content/content.model";
import { Recommendation } from "./discovery.model";

export const calculateRecommendations = async(event: any) => {
    const analytics = await Analytics.findOne({ userId: event.userId });
    if (!analytics || !analytics.genreCounts) return;

    const topGenres = Object.entries(analytics.genreCounts)
        .sort(([, a], [, b]) => Number(b) - Number(a))
        .slice(0, 2)
        .map(([genreName]) => Number(genreName));

    const candidates = await Content.find({
        genres: { $in: topGenres },
        rating: { $gt: 7 },
    }).limit(10);

    const items = candidates.map(c => ({
        contentId: c.contentId,
        score: c.rating,
        reason: `Based on your interest in ${topGenres.join(' & ')}`
    }));

    await Recommendation.findOneAndUpdate(
        { userId: event.userId },
        { $set: { items, calculatedAt: new Date() } },
        { upsert: true }
    );
};