// server/discovery/discovery.projection.ts
import { WATCH_COMPLETED } from "@/infrastructure/events/events";
import { eventBus } from "../events/eventBus";
import { Analytics } from "../analytics/analytics.model";
import { Content } from "../content/content.model";
import { Recommendation } from "./discovery.model";

eventBus.on(WATCH_COMPLETED, async (event) => {
    const analytics = await Analytics.findOne({ userId: event.userId });
    if (!analytics || !analytics.genreCounts) return;

    const topGenres = Object.entries(analytics.genreCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 2)
        .map(([id]) => Number(id));
        
    const candidates = await Content.find({
        genres: { $in: topGenres },
        rating: { $gt: 7 } 
    }).limit(10);

    const items = candidates.map(c => ({
        contentId: c.contentId,
        score: c.rating, 
        reason: `Based on your interest in ${c.type === 'movie' ? 'Cinema' : 'TV'}`
    }));

    await Recommendation.findOneAndUpdate(
        { userId: event.userId },
        { $set: { items, calculatedAt: new Date() } },
        { upsert: true }
    );
});