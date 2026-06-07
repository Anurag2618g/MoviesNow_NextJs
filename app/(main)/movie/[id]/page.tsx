'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Play, Plus, Check, Star, ArrowLeft } from 'lucide-react';
import { contentApi, watchApi } from '@/lib/api/content';
import { useAuth } from '@/lib/auth/AuthContext';
import Button from '@/components/ui/Button';

export default function MoviePage() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const router = useRouter();

    const [movie, setMovie] = useState<any>(null);
    const [inWatchlist, setInWatchlist] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await contentApi.getById(Number(id));
                setMovie(data);
            } catch {
                router.push('/');
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [id, router]);

    const toggleWatchlist = async () => {
        if (!user) { router.push('/login'); return; }
        try {
            if (inWatchlist) {
                await watchApi.removeFromWatchlist(id);
                setInWatchlist(false);
            } else {
                await watchApi.addToWatchlist(id);
                setInWatchlist(true);
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!movie) return null;

    const backdropUrl = movie.backdropPath
        ? `https://image.tmdb.org/t/p/original${movie.backdropPath}`
        : null;

    const posterUrl = movie.posterPath
        ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
        : null;

    return (
        <div className="min-h-screen bg-[#141414]">
            {/* Backdrop */}
            {backdropUrl && (
                <div className="relative h-[60vh] w-full">
                    <Image src={backdropUrl} alt={movie.title} fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-linear-to-t from-[#141414] via-[#141414]/40 to-transparent" />
                    <div className="absolute inset-0 bg-linear-to-r from-[#141414]/80 to-transparent" />
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 px-6 md:px-12 -mt-40 pb-16">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={18} /> Back
                </button>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Poster */}
                    {posterUrl && (
                        <div className="flex-none w-48 md:w-64 rounded-lg overflow-hidden shadow-2xl">
                            <Image src={posterUrl} alt={movie.title} width={256} height={384} className="w-full" />
                        </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 pt-4">
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-3">{movie.title}</h1>

                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                            {movie.releaseDate && (
                                <span>{new Date(movie.releaseDate).getFullYear()}</span>
                            )}
                            {movie.rating != null && (
                                <span className="flex items-center gap-1 text-yellow-400">
                                    <Star size={14} fill="currentColor" />
                                    {movie.rating.toFixed(1)}
                                </span>
                            )}
                            {movie.voteCount != null && (
                                <span>{movie.voteCount.toLocaleString()} votes</span>
                            )}
                        </div>

                        <p className="text-gray-300 text-base leading-relaxed mb-6 max-w-2xl">
                            {movie.overview}
                        </p>

                        <div className="flex items-center gap-3">
                            <Button variant="primary" size="lg" className="flex items-center gap-2">
                                <Play size={18} fill="black" /> Play
                            </Button>
                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={toggleWatchlist}
                                className="flex items-center gap-2"
                            >
                                {inWatchlist
                                    ? <><Check size={18} /> In My List</>
                                    : <><Plus size={18} /> My List</>
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
