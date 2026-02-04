/* eslint-disable @typescript-eslint/no-explicit-any */
import WatchHistory from "./watch.model";

export async function getWatchHistoryPage({
  userId,
  limit,
  cursor,
}: {
  userId: string;
  limit: number;
  cursor?: { lastWatchedAt: string; id: string };
}) {
  const query: any = { userId };

  if (cursor) {
    query.$or = [
      { lastWatchedAt: { $lt: new Date(cursor.lastWatchedAt) } },
      {
        lastWatchedAt: new Date(cursor.lastWatchedAt),
        _id: { $lt: cursor.id },
      },
    ];
  }

  return WatchHistory.find(query)
    .sort({ lastWatchedAt: -1, _id: -1 })
    .limit(limit)
    .lean();
}
