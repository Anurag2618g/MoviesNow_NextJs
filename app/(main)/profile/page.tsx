'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Clock, CheckCircle, TrendingUp, Film } from 'lucide-react';
import { userApi } from '@/lib/api/content';
import { useAuth } from '@/lib/auth/AuthContext';

interface Analytics {
    totalWatchTime: number;
    totalCompleted: number;
    completionRate: number;
    favoriteGenres: string[];
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="bg-[#1f1f1f] border border-[#333] rounded-xl p-5 flex items-center gap-4">
            <div className="text-[#e50914]">{icon}</div>
            <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-sm text-gray-400">{label}</p>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const { user, isLoading: authLoading, logout } = useAuth();
    const router = useRouter();
    const [analytics, setAnalytics] = useState<Analytics | null>(null);

    useEffect(() => {
        if (authLoading) return;
        if (!user) { router.replace('/login'); return; }

        userApi.getAnalytics()
            .then(setAnalytics)
            .catch(console.error);
    }, [user, authLoading, router]);

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    // Format minutes into hours/minutes
    const formatWatchTime = (minutes: number) => {
        if (minutes < 60) return `${minutes}m`;
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return m > 0 ? `${h}h ${m}m` : `${h}h`;
    };

    if (!user) return null;

    return (
        <div className="min-h-screen pt-24 px-6 md:px-12 pb-16">
            {/* Profile header */}
            <div className="flex items-center gap-5 mb-10">
                <div className="w-20 h-20 rounded-full bg-[#e50914] flex items-center justify-center text-3xl font-black text-white">
                    {user.email[0].toUpperCase()}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">{user.email}</h1>
                    <p className="text-gray-400 text-sm capitalize mt-1">{user.role} account</p>
                </div>
            </div>

            {/* Stats */}
            {analytics && (
                <div className="mb-10">
                    <h2 className="text-lg font-semibold text-white mb-4">Your Stats</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard
                            icon={<Clock size={24} />}
                            label="Watch Time"
                            value={formatWatchTime(analytics.totalWatchTime)}
                        />
                        <StatCard
                            icon={<CheckCircle size={24} />}
                            label="Completed"
                            value={String(analytics.totalCompleted)}
                        />
                        <StatCard
                            icon={<TrendingUp size={24} />}
                            label="Completion Rate"
                            value={`${Math.round(analytics.completionRate * 100)}%`}
                        />
                        <StatCard
                            icon={<Film size={24} />}
                            label="Favorite Genres"
                            value={analytics.favoriteGenres.length > 0 ? String(analytics.favoriteGenres.length) : '—'}
                        />
                    </div>

                    {analytics.favoriteGenres.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-400 mb-2">Top genres</p>
                            <div className="flex flex-wrap gap-2">
                                {analytics.favoriteGenres.map(genre => (
                                    <span key={genre} className="px-3 py-1 bg-[#1f1f1f] border border-[#333] rounded-full text-sm text-gray-300">
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Sign out */}
            <button
                onClick={handleLogout}
                className="px-6 py-2.5 border border-[#e50914] text-[#e50914] hover:bg-[#e50914] hover:text-white rounded transition-colors text-sm font-semibold"
            >
                Sign Out
            </button>
        </div>
    );
}
