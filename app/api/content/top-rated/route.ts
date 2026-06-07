import { getTopRatedMovies } from "@/server/tmdb/movies";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') ?? '1');
    try {
        const data = await getTopRatedMovies(page);
        return NextResponse.json(data);
    } catch (err: unknown) {
        return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
    }
};
