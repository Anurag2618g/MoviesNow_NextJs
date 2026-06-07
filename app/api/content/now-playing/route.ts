import { getNowPlayingMovies } from "@/server/tmdb/movies";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const data = await getNowPlayingMovies();
        return NextResponse.json(data);
    } catch (err: unknown) {
        return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
    }
};
