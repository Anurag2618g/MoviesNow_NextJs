import { WATCH_COMPLETED, WATCH_PROGRESS_UPDATED, WATCH_STARTED } from "@/infrastructure/events/events";
import { ensureContentExists } from "../content/content.service";
import { connectDB } from "@/infrastructure/db/mongo";
import { publishEvent } from "@/infrastructure/events/producer";
import { WatchHistory } from "./watch.model";

type UpdateProgressInput = {
  userId: string;
  contentId: string;
  progress: number;
  duration: number;
};

export const updateWatchProgress = async ({
  userId,
  contentId,
  progress,
  duration,
}: UpdateProgressInput) => {
  await connectDB();
  await ensureContentExists(contentId, "movie");

  if (progress < 0 || duration < 0 || progress > duration) {
    throw new Error("Invalid progress data");
  }
  const status = progress >= duration ? "completed" : "in_progress";
  const updatedAt = new Date();
  const existing = await WatchHistory.findOne({ userId, contentId });

  const doc = await WatchHistory.findOneAndUpdate(
    { userId, contentId },
    {
      $set: {
        progress,
        duration,
        status,
        lastWatchedAt: updatedAt,
      },
    },
    { upsert: true, new: true },
  );

  const baseEvent = {
    userId,
    contentId,
    duration,
    progress,
    status,
    updatedAt: updatedAt.toISOString(),
  };

  if (!existing && progress > 0) {
    await publishEvent(WATCH_STARTED, baseEvent);
  }
  if (status === "completed") {
    await publishEvent(WATCH_COMPLETED, baseEvent);
  } else {
    await publishEvent(WATCH_PROGRESS_UPDATED, baseEvent);
  }

  return {
    contentId: doc.contentId,
    progress: doc.progress,
    duration: doc.duration,
    status: doc.status,
    lastWatchedAt: doc.lastWatchedAt,
  };
};
