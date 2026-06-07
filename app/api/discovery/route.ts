import { getHomeFeed } from "@/server/discovery/discovery.service";
import { NextResponse } from "next/server";

// GET /api/discovery — returns personalized home feed for the logged-in user
export const GET = async (req: Request) => {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const feed = await getHomeFeed(userId);
        return NextResponse.json(feed);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
};
