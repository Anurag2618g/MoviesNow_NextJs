import { addToWatchlist, removeFromWatchlist } from "@/server/watchlist/watchlist.service";
import { getWatchlist } from "@/server/watchlist/watchlist.query";
import { NextResponse } from "next/server";

// GET /api/watch/watchlist — fetch the user's watchlist
export const GET = async (req: Request) => {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const items = await getWatchlist(userId);
        return NextResponse.json(items);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
};

// POST /api/watch/watchlist — add a movie to the watchlist
export const POST = async (req: Request) => {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.contentId || typeof body.contentId !== "string") {
        return NextResponse.json({ error: "contentId is required" }, { status: 400 });
    }

    try {
        await addToWatchlist(userId, body.contentId);
        return NextResponse.json({ success: true }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
};

// DELETE /api/watch/watchlist — remove a movie from the watchlist
export const DELETE = async (req: Request) => {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.contentId || typeof body.contentId !== "string") {
        return NextResponse.json({ error: "contentId is required" }, { status: 400 });
    }

    try {
        await removeFromWatchlist(userId, body.contentId);
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
};
