import { getUpcomingMovies } from "@/server/tmdb/movies";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const data = await getUpcomingMovies();
        return NextResponse.json(data);
    } catch (err: unknown) {
        return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
    }
};
