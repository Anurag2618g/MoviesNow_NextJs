import { eventBus } from "../events/eventBus";
import { deleteCache } from "../cache/redisCache";
import { WATCH_PROGRESS_UPDATED } from "../events/events";
import { ContinueWatching } from "./continueWatching.model";
import { WATCH_COMPLETED, WATCH_STARTED } from "@/infrastructure/events/events";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handler = async (event: any) => {
  await ContinueWatching.findOneAndUpdate(
    { userId: event.userId, contentId: event.contentId },
    {
      $set: {
        progress: event.progress,
        duration: event.duration,
        lastWatchedAt: event.updatedAt,
      },
    },
    { upsert: true },
  );
};

eventBus.on(WATCH_STARTED, handler);

eventBus.on(WATCH_PROGRESS_UPDATED, handler);

eventBus.on(WATCH_COMPLETED, async (event) => {
  await ContinueWatching.deleteOne({
    userId: event.userId,
    contentId: event.contentId,
  });
  await deleteCache(`continue:${event.userId}`);
});
