import { getTrendingMovies } from "@/server/tmdb/movies"
import { NextResponse } from "next/server";

export const GET = async () => {
    const result = await getTrendingMovies();
    return NextResponse.json(result);
}