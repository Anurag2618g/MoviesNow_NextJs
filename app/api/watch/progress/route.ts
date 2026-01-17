import { updateWatchProgress } from "@/server/watch/watch.service";
import { NextResponse } from "next/server";

export const POST = async(req: Request) => {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 },
        );
    }

    const { contentId, progress, duration } = await req.json();
    if (typeof(contentId) !== 'string'
        || typeof(progress) !== 'number'
        || typeof(duration) !== 'number'
    ) {
        return NextResponse.json(
            { error: 'Invalid Input' },
            { status: 400 },
        );
    }

    try {
        const result = await updateWatchProgress({
            userId,
            contentId,
            progress,
            duration
        });
    
        return NextResponse.json(result);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: 400 },
        );
    }
};