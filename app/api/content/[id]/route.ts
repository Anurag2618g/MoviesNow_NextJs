import { getMovieById } from "@/server/tmdb/movies";
import { NextResponse } from "next/server";

export const GET = async (
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    const { id } = await params;

    const tmdbId = Number(id);
    if (isNaN(tmdbId) || tmdbId <= 0) {
        return NextResponse.json(
            { error: "Invalid content ID" },
            { status: 400 }
        );
    }

    try {
        const movie = await getMovieById(tmdbId);
        return NextResponse.json(movie);
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
};
