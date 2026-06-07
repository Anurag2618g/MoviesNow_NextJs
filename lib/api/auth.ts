/**
 * Auth API Client
 * All authentication-related API calls in one place.
 */

export const authApi = {
    async signup(email: string, password: string) {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Signup failed');
        return data;
    },

    async login(email: string, password: string) {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        // route returns { accessToken: string }
        return data.accessToken as string;
    },

    async logout() {
        await fetch('/api/auth/logout', { method: 'POST' });
    },

    async refresh(): Promise<string | null> {
        const res = await fetch('/api/auth/refresh', { method: 'POST' });
        if (!res.ok) return null;
        const data = await res.json();
        return data.accessToken as string;
    },
};
