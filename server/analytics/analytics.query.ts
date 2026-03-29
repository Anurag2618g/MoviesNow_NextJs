import { Analytics } from "./analytics.model";

export const getUserAnalytics = async (userId: string) => {
    const data = await Analytics.findOne({ userId: userId }).lean();

    if (!data) {
        return {
            totalWatchTime: 0,
            totalCompleted: 0,
            completionRate: 0,
            favoriteGenres: [],
        };
    }

    const completionRate = data.totalStarted > 0? data.totalCompleted / data.totalStarted : 0;

    const sortedGenres = Object.entries(data.genreCounts || {})
        .sort((a, b) => (b[1] as number) - (a[1] as number))
        .slice(0, 5)
        .map(([genre]) => genre);

    return {
        totalWatchTime: data.totalWatchTime,
        totalCompleted: data.totalCompleted,
        completionRate: completionRate,
        favoriteGenres: sortedGenres,
    };
};