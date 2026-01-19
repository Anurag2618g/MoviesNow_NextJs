import { getWatchHistory } from "@/server/watch/watch.history.query";
import { NextResponse } from "next/server";

export const GET = async(req: Request) => {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 },
        );
    }

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor') || undefined;
    const limit = Math.min(Number(searchParams.get('limit')) || 20, 50);

    const result = await getWatchHistory({ userId, limit, cursor });

    return NextResponse.json(result);
};  