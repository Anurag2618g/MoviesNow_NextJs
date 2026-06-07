/**
 * Content API Client
 * Movies, search, trending.
 */

import { getAccessToken } from '@/lib/auth/token';

export const contentApi = {
    async getTrending() {
        const res = await fetch('/api/content/trending/movies');
        if (!res.ok) throw new Error('Failed to fetch trending');
        return res.json();
    },

    async getById(id: number) {
        const res = await fetch(`/api/content/${id}`);
        if (!res.ok) throw new Error('Failed to fetch movie');
        return res.json();
    },

    async search(query: string, page = 1) {
        const res = await fetch(`/api/content/search?q=${encodeURIComponent(query)}&page=${page}`);
        if (!res.ok) throw new Error('Search failed');
        return res.json();
    },
};

export const watchApi = {
    async getHistory(cursor?: string, limit = 20) {
        const token = getAccessToken();
        const params = new URLSearchParams({ limit: String(limit) });
        if (cursor) params.set('cursor', cursor);
        const res = await fetch(`/api/watch/history?${params}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch history');
        return res.json();
    },

    async getContinueWatching() {
        const token = getAccessToken();
        const res = await fetch('/api/watch/continue', {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch continue watching');
        return res.json();
    },

    async updateProgress(contentId: string, progress: number, duration: number) {
        const token = getAccessToken();
        const res = await fetch('/api/watch/progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ contentId, progress, duration }),
        });
        if (!res.ok) throw new Error('Failed to update progress');
        return res.json();
    },

    async getWatchlist() {
        const token = getAccessToken();
        const res = await fetch('/api/watch/watchlist', {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch watchlist');
        return res.json();
    },

    async addToWatchlist(contentId: string) {
        const token = getAccessToken();
        const res = await fetch('/api/watch/watchlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ contentId }),
        });
        if (!res.ok) throw new Error('Failed to add to watchlist');
        return res.json();
    },

    async removeFromWatchlist(contentId: string) {
        const token = getAccessToken();
        const res = await fetch('/api/watch/watchlist', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ contentId }),
        });
        if (!res.ok) throw new Error('Failed to remove from watchlist');
        return res.json();
    },
};

export const userApi = {
    async getMe() {
        const token = getAccessToken();
        const res = await fetch('/api/users/me', {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
    },

    async getAnalytics() {
        const token = getAccessToken();
        const res = await fetch('/api/users/analytics', {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch analytics');
        return res.json();
    },

    async getDiscovery() {
        const token = getAccessToken();
        const res = await fetch('/api/discovery', {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch discovery feed');
        return res.json();
    },
};
