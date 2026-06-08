/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { contentApi } from '@/lib/api/content';
import MovieCard from '@/components/movies/MovieCard';

// 1. Move all the search UI and logic into an internal content component
function SearchPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialQuery = searchParams.get('q') || '';

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const doSearch = useCallback(async (q: string) => {
        if (!q.trim()) return;
        setIsLoading(true);
        setSearched(true);
        try {
            const data = await contentApi.search(q);
            setResults(data.results || []);
        } catch {
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Run search when page loads with a query param
    useEffect(() => {
        if (initialQuery) doSearch(initialQuery);
    }, [initialQuery, doSearch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(query)}`);
        doSearch(query);
    };

    return (
        <div className="min-h-screen pt-24 px-6 md:px-12 pb-16">
            <h1 className="text-2xl font-bold text-white mb-6">Search Movies</h1>

            {/* Search input */}
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-xl mb-10">
                <div className="flex-1 relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search for movies..."
                        className="w-full pl-10 pr-4 py-3 bg-[#1f1f1f] border border-[#333] rounded text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                        autoFocus
                    />
                </div>
                <button
                    type="submit"
                    className="px-6 py-3 bg-[#e50914] hover:bg-[#f40612] text-white font-semibold rounded transition-colors"
                >
                    Search
                </button>
            </form>

            {/* Loading */}
            {isLoading && (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Results */}
            {!isLoading && searched && (
                <>
                    {results.length > 0 ? (
                        <>
                            <p className="text-gray-400 text-sm mb-4">{results.length} results for "{initialQuery}"</p>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
                                {results.map((movie: any) => (
                                    <MovieCard
                                        key={movie.id}
                                        id={movie.id}
                                        title={movie.title}
                                        posterPath={movie.poster_path}
                                        rating={movie.vote_average}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20 text-gray-500">
                            <Search size={48} className="mx-auto mb-4 opacity-30" />
                            <p className="text-lg">No results found for "{initialQuery}"</p>
                            <p className="text-sm mt-2">Try a different search term</p>
                        </div>
                    )}
                </>
            )}

            {/* Empty state before search */}
            {!isLoading && !searched && (
                <div className="text-center py-20 text-gray-500">
                    <Search size={48} className="mx-auto mb-4 opacity-30" />
                    <p>Search for your favorite movies</p>
                </div>
            )}
        </div>
    );
}

// 2. The main export safely wraps the component in a Suspense boundary
export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen pt-24 px-6 md:px-12 pb-16 flex justify-center items-center">
                <div className="w-10 h-10 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <SearchPageContent />
        </Suspense>
    );
}