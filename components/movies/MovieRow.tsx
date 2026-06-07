'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { cn } from '@/lib/utils';

interface Movie {
    id: number;
    title: string;
    posterPath: string | null;
    rating?: number;
    progress?: number;
}

interface MovieRowProps {
    title: string;
    movies: Movie[];
    className?: string;
}

export default function MovieRow({ title, movies, className }: MovieRowProps) {
    const rowRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (!rowRef.current) return;
        const scrollAmount = rowRef.current.clientWidth * 0.75;
        rowRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    if (!movies.length) return null;

    return (
        <div className={cn('relative group/row', className)}>
            <h2 className="text-lg font-semibold text-white mb-3 px-6 md:px-12">{title}</h2>

            <div className="relative">
                {/* Left scroll button */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-black/50 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-black/70"
                >
                    <ChevronLeft size={24} className="text-white" />
                </button>

                {/* Scrollable row */}
                <div
                    ref={rowRef}
                    className="flex gap-2 overflow-x-auto scrollbar-hide px-6 md:px-12 pb-2"
                >
                    {movies.map(movie => (
                        <MovieCard
                            key={movie.id}
                            id={movie.id}
                            title={movie.title}
                            posterPath={movie.posterPath}
                            rating={movie.rating}
                            progress={movie.progress}
                            className="flex-none w-[140px] md:w-[180px]"
                        />
                    ))}
                </div>

                {/* Right scroll button */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-black/50 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-black/70"
                >
                    <ChevronRight size={24} className="text-white" />
                </button>
            </div>
        </div>
    );
}
