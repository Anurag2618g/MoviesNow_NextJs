'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookMarked } from 'lucide-react';
import { watchApi } from '@/lib/api/content';
import { useAuth } from '@/lib/auth/AuthContext';
import MovieCard from '@/components/movies/MovieCard';

export default function WatchlistPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user) { router.replace('/login'); return; }

        watchApi.getWatchlist()
            .then(setItems)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [user, authLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-6 md:px-12 pb-16">
            <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <BookMarked size={24} className="text-[#e50914]" /> My List
            </h1>

            {items.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <BookMarked size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="text-lg">Your list is empty</p>
                    <p className="text-sm mt-2">Add movies by clicking the + button on any movie</p>
                </div>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
                    {items.map((item: any) => (
                        <MovieCard
                            key={item.contentId}
                            id={Number(item.contentId)}
                            title={item.title || 'Unknown'}
                            posterPath={item.posterPath}
                            rating={item.rating}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
