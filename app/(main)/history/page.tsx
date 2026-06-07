'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { History } from 'lucide-react';
import { watchApi } from '@/lib/api/content';
import { useAuth } from '@/lib/auth/AuthContext';
import MovieCard from '@/components/movies/MovieCard';
import Button from '@/components/ui/Button';

export default function HistoryPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [items, setItems] = useState<any[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    useEffect(() => {
        if (authLoading) return;
        if (!user) { router.replace('/login'); return; }

        watchApi.getHistory()
            .then(data => {
                setItems(data.items || []);
                setNextCursor(data.nextCursor ? JSON.stringify(data.nextCursor) : null);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [user, authLoading, router]);

    const loadMore = async () => {
        if (!nextCursor) return;
        setIsLoadingMore(true);
        try {
            const data = await watchApi.getHistory(nextCursor);
            setItems(prev => [...prev, ...(data.items || [])]);
            setNextCursor(data.nextCursor ? JSON.stringify(data.nextCursor) : null);
        } finally {
            setIsLoadingMore(false);
        }
    };

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
                <History size={24} className="text-[#e50914]" /> Watch History
            </h1>

            {items.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <History size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="text-lg">No watch history yet</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
                        {items.map((item: any, i: number) => (
                            <MovieCard
                                key={`${item.content?.id}-${i}`}
                                id={item.content?.id}
                                title={item.content?.title || 'Unknown'}
                                posterPath={item.content?.posterPath}
                                rating={item.content?.rating}
                                progress={item.duration > 0 ? (item.progress / item.duration) * 100 : 0}
                            />
                        ))}
                    </div>

                    {/* Cursor-based load more */}
                    {nextCursor && (
                        <div className="flex justify-center mt-8">
                            <Button variant="secondary" onClick={loadMore} isLoading={isLoadingMore}>
                                Load More
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
