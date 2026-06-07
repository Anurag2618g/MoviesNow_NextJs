/* eslint-disable @typescript-eslint/no-explicit-any */
import { deleteCache } from "@/infrastructure/cache/redisCache";
import { ContinueWatching } from "./continueWatching.model";

export const handleWatchProgress = async (event: any) => {
  await ContinueWatching.findOneAndUpdate(
    { userId: event.userId, contentId: event.contentId },
    {
      $set: {
        progress: event.progress,
        duration: event.duration,
        lastWatchedAt: new Date(event.updatedAt),
      },
    },
    { upsert: true },
  );
  await deleteCache(`continue:${event.userId}`);
};

export const handleWatchCompleted = async (event: any) => {
  await ContinueWatching.deleteOne({
    userId: event.userId,
    contentId: event.contentId,
  });
  await deleteCache(`continue:${event.userId}`);
};