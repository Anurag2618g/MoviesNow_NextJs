'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, Bell, ChevronDown, LogOut, User, BookMarked, History } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Make navbar background solid when user scrolls down
    if (typeof window !== 'undefined') {
        window.onscroll = () => setScrolled(window.scrollY > 20);
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <nav className={cn(
            'fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 flex items-center justify-between transition-all duration-300',
            scrolled ? 'bg-[#141414]' : 'bg-linear-to-b from-black/80 to-transparent'
        )}>
            {/* Logo */}
            <div className="flex items-center gap-8">
                <Link href="/" className="text-[#e50914] font-black text-2xl tracking-tight">
                    MOVIESNOW
                </Link>

                {/* Nav links — only show when logged in */}
                {user && (
                    <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <Link href="/search" className="hover:text-white transition-colors">Movies</Link>
                        <Link href="/watchlist" className="hover:text-white transition-colors">My List</Link>
                    </div>
                )}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        {/* Search bar */}
                        <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 bg-black/50 border border-white/20 rounded px-3 py-1.5">
                            <Search size={16} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search movies..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none w-40"
                            />
                        </form>

                        <Bell size={20} className="text-gray-300 hover:text-white cursor-pointer" />

                        {/* User dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                            >
                                <div className="w-8 h-8 rounded bg-[#e50914] flex items-center justify-center text-sm font-bold">
                                    {user.email[0].toUpperCase()}
                                </div>
                                <ChevronDown size={16} className={cn('text-gray-300 transition-transform', showDropdown && 'rotate-180')} />
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 top-12 w-48 bg-[#1f1f1f] border border-[#333] rounded shadow-xl py-1 z-50">
                                    <div className="px-4 py-2 text-xs text-gray-400 border-b border-[#333]">
                                        {user.email}
                                    </div>
                                    <Link href="/profile" onClick={() => setShowDropdown(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors">
                                        <User size={15} /> Profile
                                    </Link>
                                    <Link href="/watchlist" onClick={() => setShowDropdown(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors">
                                        <BookMarked size={15} /> My List
                                    </Link>
                                    <Link href="/history" onClick={() => setShowDropdown(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors">
                                        <History size={15} /> Watch History
                                    </Link>
                                    <button onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 transition-colors border-t border-[#333] mt-1">
                                        <LogOut size={15} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <Link href="/login"
                        className="bg-[#e50914] hover:bg-[#f40612] text-white text-sm font-semibold px-5 py-2 rounded transition-colors">
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
}
