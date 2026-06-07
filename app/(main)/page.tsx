'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Play, Info } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { contentApi, userApi, watchApi } from '@/lib/api/content';
import MovieRow from '@/components/movies/MovieRow';
import Button from '@/components/ui/Button';

interface Movie {
    id: number;
    title: string;
    posterPath: string | null;
    backdropPath: string | null;
    overview: string;
    rating: number;
}

export default function HomePage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [hero, setHero] = useState<Movie | null>(null);
    const [trending, setTrending] = useState<Movie[]>([]);
    const [continueWatching, setContinueWatching] = useState<Record<string, unknown>[]>([]);
    const [forYou, setForYou] = useState<Record<string, unknown>[]>([]);
    const [isLoading, setIsLoading] = useState(false); // start false, only true when fetching data

    // Wait for auth to resolve before doing anything
    // Show spinner while auth is loading — don't redirect yet
    useEffect(() => {
        console.log('[Home] auth state — authLoading:', authLoading, '| user:', !!user);
        if (authLoading) return;
        if (!user) {
            console.log('[Home] no user after load, redirecting to /login');
            router.replace('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (!user) return;

        const loadData = async () => {
            setIsLoading(true);
            try {
                // Load trending (public) and personalized feed in parallel
                const [trendingData, feedData, continueData] = await Promise.all([
                    contentApi.getTrending(),
                    userApi.getDiscovery().catch(() => null),
                    watchApi.getContinueWatching().catch(() => [] as Record<string, unknown>[]),
                ]);

                const movies: Movie[] = ((trendingData as { results?: Record<string, unknown>[] }).results || []).map((m) => ({
                    id: m.id as number,
                    title: m.title as string,
                    posterPath: m.poster_path as string | null,
                    backdropPath: m.backdrop_path as string | null,
                    overview: m.overview as string,
                    rating: m.vote_average as number,
                }));

                setTrending(movies);
                setHero(movies[0] || null);

                if ((feedData as { forYou?: unknown[] } | null)?.forYou?.length) setForYou((feedData as { forYou: Record<string, unknown>[] }).forYou);
                if ((continueData as unknown[])?.length) setContinueWatching(continueData as Record<string, unknown>[]);
            } catch (err) {
                console.error('Failed to load home data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [user]);

    // Show spinner while auth is still resolving (page refresh recovery)
    // or while data is loading after auth confirmed
    if (authLoading || (user && isLoading)) {
        return (
            <div className="min-h-screen bg-[#141414] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Auth resolved, not logged in — redirect effect will fire, render nothing meanwhile
    if (!user) return null;

    const heroImageUrl = hero?.backdropPath
        ? `https://image.tmdb.org/t/p/original${hero.backdropPath}`
        : null;

    return (
        <div className="min-h-screen bg-[#141414]">
            {/* Hero Banner */}
            {hero && (
                <div className="relative h-[85vh] w-full">
                    {/* Backdrop image */}
                    {heroImageUrl && (
                        <Image
                            src={heroImageUrl}
                            alt={hero.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    )}

                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-linear-to-r from-[#141414] via-[#141414]/60 to-transparent" />
                    <div className="absolute inset-0 bg-linear-to-t from-[#141414] via-transparent to-transparent" />

                    {/* Hero content */}
                    <div className="absolute bottom-32 left-6 md:left-12 max-w-xl">
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
                            {hero.title}
                        </h1>
                        <p className="text-sm md:text-base text-gray-300 mb-6 line-clamp-3">
                            {hero.overview}
                        </p>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => router.push(`/movie/${hero.id}`)}
                                className="flex items-center gap-2"
                            >
                                <Play size={18} fill="black" /> Play
                            </Button>
                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={() => router.push(`/movie/${hero.id}`)}
                                className="flex items-center gap-2"
                            >
                                <Info size={18} /> More Info
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Content rows */}
            <div className="relative z-10 -mt-20 pb-16 flex flex-col gap-10">
                {continueWatching.length > 0 && (
                    <MovieRow
                        title="Continue Watching"
                        movies={continueWatching.map((item) => ({
                            id: Number(item.contentId),
                            title: item.title as string,
                            posterPath: item.posterPath as string | null,
                            rating: item.rating as number,
                            progress: (item.duration as number) > 0 ? ((item.progress as number) / (item.duration as number)) * 100 : 0,
                        }))}
                    />
                )}

                {forYou.length > 0 && (
                    <MovieRow
                        title="Recommended For You"
                        movies={forYou.map((item) => ({
                            id: Number(item.contentId),
                            title: item.title as string,
                            posterPath: item.posterPath as string | null,
                            rating: item.rating as number,
                        }))}
                    />
                )}

                <MovieRow
                    title="Trending This Week"
                    movies={trending.map(m => ({
                        id: m.id,
                        title: m.title,
                        posterPath: m.posterPath,
                        rating: m.rating,
                    }))}
                />
            </div>
        </div>
    );
}
