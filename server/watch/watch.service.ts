import { connectDB } from "../db/mongo";

type UpdateProgressInput = {
    userID: string,
    contentId: string,
    progress: number,
    duration: number,
};

export const updateWatchProgress = async({ userId, contentId, progress, duration }: UpdateProgressInput) => {
    await connectDB();

    if (progress < 0 || duration < 0 || progress > duration) {
        throw new Error("Invalid progress data");
    }
};