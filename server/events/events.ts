export const WATCH_PROGRESS_UPDATED = 'watch.progress_updated';

export type watchProgressUpdatedEvent = {
    userId: string;
    contentId: string;
    progress: number;
    duration: number;
};