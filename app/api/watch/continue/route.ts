import { getContinueWatching } from "@/server/watch/watch.query";
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
    const limitParam = searchParams.get('limit');
    const limit = limitParam? Number(limitParam) : 10;

    if (Number.isNaN(limit) || limit <= 0 || limit >= 50) {
        return NextResponse.json(
            { error: 'Invalid limit' },
            { status: 400 },
        );
    }

    const items = await getContinueWatching(userId, limit);

    return { items };
};