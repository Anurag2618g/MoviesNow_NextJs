'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Plus, Check, Play, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { watchApi } from '@/lib/api/content';
import { useAuth } from '@/lib/auth/AuthContext';

interface MovieCardProps {
    id: number;
    title: string;
    posterPath: string | null;
    rating?: number;
    progress?: number;   // 0-100 percentage, for continue watching
    duration?: number;
    className?: string;
}

export default function MovieCard({ id, title, posterPath, rating, progress, className }: MovieCardProps) {
    const { user } = useAuth();
    const [inWatchlist, setInWatchlist] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isBusy, setIsBusy] = useState(false); // prevent double-clicks

    const imageUrl = posterPath
        ? `https://image.tmdb.org/t/p/w500${posterPath}`
        : null;

    const progressPercent = progress != null ? Math.min(100, Math.round(progress)) : null;

    const toggleWatchlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user || isBusy) return;
        setIsBusy(true);
        try {
            if (inWatchlist) {
                await watchApi.removeFromWatchlist(String(id));
                setInWatchlist(false);
            } else {
                await watchApi.addToWatchlist(String(id));
                setInWatchlist(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsBusy(false);
        }
    };

    return (
        <Link href={`/movie/${id}`}>
            <div
                className={cn(
                    'relative rounded overflow-hidden cursor-pointer group',
                    'transition-transform duration-200 hover:scale-105 hover:z-10',
                    className
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Poster image */}
                <div className="aspect-2/3 bg-[#1f1f1f] relative">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 40vw, 200px"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs text-center p-2">
                            {title}
                        </div>
                    )}

                    {/* Hover overlay */}
                    <div className={cn(
                        'absolute inset-0 bg-black/60 flex flex-col justify-end p-3 transition-opacity duration-200',
                        isHovered ? 'opacity-100' : 'opacity-0'
                    )}>
                        <div className="flex items-center gap-2 mb-2">
                            {/* Play button */}
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors">
                                <Play size={14} fill="black" className="text-black ml-0.5" />
                            </div>

                            {/* Watchlist button */}
                            {user && (
                                <button
                                    onClick={toggleWatchlist}
                                    disabled={isBusy}
                                    className="w-8 h-8 rounded-full border-2 border-white/70 flex items-center justify-center hover:border-white transition-colors disabled:opacity-50"
                                >
                                    {isBusy
                                        ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                                        : inWatchlist
                                            ? <Check size={14} className="text-white" />
                                            : <Plus size={14} className="text-white" />
                                    }
                                </button>
                            )}
                        </div>

                        {/* Rating */}
                        {rating != null && (
                            <div className="flex items-center gap-1 text-xs text-yellow-400">
                                <Star size={11} fill="currentColor" />
                                <span>{rating.toFixed(1)}</span>
                            </div>
                        )}

                        <p className="text-xs text-white font-medium mt-1 line-clamp-2">{title}</p>
                    </div>
                </div>

                {/* Progress bar for continue watching */}
                {progressPercent != null && (
                    <div className="h-1 bg-[#333] w-full">
                        <div
                            className="h-full bg-[#e50914] transition-all"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                )}
            </div>
        </Link>
    );
}
