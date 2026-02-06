export type TmdbMovie = {
    id: number;
    title: string;
    overview: string,
    poster_path: string | null;
    backdrop_path: string | null;
    release_Date: string,
    vote_average: number;
    vote_count: number,
    genre_ids: number[]; 
};

export type TmdbListResponse<T> = {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
};

export type MovieDetails = {
    id: number,
    title: string,
    overview: string,
    posterPath: string | null,
    backdropPath: string | null,
    releaseDate: string,
    rating: number,
    voteCount: number,
};