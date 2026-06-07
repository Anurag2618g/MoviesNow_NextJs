'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '@/lib/api/auth';
import { setAccessToken, clearAccessToken } from './token';

interface User {
    id: string;
    email: string;
    role: string;
}

interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Helper — fetch the current user with a token and return the user object
async function fetchCurrentUser(token: string): Promise<User | null> {
    const res = await fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    console.log('[Auth] /api/users/me →', res.status, JSON.stringify(body));
    if (!res.ok) return null;
    return body as User;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // On mount: try to restore session via refresh token cookie
    useEffect(() => {
        const restoreSession = async () => {
            console.log('[Auth] restoreSession start');
            try {
                const token = await authApi.refresh();
                console.log('[Auth] refresh token present:', !!token);
                if (token) {
                    setAccessToken(token);
                    const userData = await fetchCurrentUser(token);
                    if (userData) setUser(userData);
                }
            } catch (e) {
                console.error('[Auth] restoreSession error:', e);
            } finally {
                console.log('[Auth] restoreSession done');
                setIsLoading(false);
            }
        };
        restoreSession();
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const token = await authApi.login(email, password);
        console.log('[Auth] login — token received:', !!token, '| value:', token?.slice(0, 20));
        setAccessToken(token);
        const userData = await fetchCurrentUser(token);
        console.log('[Auth] login — user fetched:', userData);
        if (!userData) {
            throw new Error('Login succeeded but failed to fetch user profile');
        }
        setUser(userData);
    }, []);

    const signup = useCallback(async (email: string, password: string) => {
        await authApi.signup(email, password);
        await login(email, password);
    }, [login]);

    const logout = useCallback(async () => {
        await authApi.logout();
        clearAccessToken();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
