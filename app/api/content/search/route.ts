import { searchMovies } from "@/server/tmdb/movies";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const page = Number(searchParams.get("page") ?? "1");

    if (!query || query.trim().length === 0) {
        return NextResponse.json(
            { error: "Search query is required" },
            { status: 400 }
        );
    }

    try {
        const results = await searchMovies(query.trim(), page);
        return NextResponse.json(results);
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
};
