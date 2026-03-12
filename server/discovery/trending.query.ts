import { getContentByIds } from "../content/content.query";
import { Trending } from "./trending.model";

export const getTrending = async(limit = 10) => {
    const items = await Trending.find({}).sort({ score: -1 }).limit(limit).lean();
    const contentIds = items.map(i => i.contentId);
    const contentMap = await getContentByIds(contentIds);

    return items.map(item => {
        const content = contentMap.get(item.contentId);

        return {
            contentId: item.contentId,
            title: content?.title,
            posterPath: content?.posterPath,
            rating: content?.rating,
            score: item.score
        };
    });
};