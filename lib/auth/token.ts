/**
 * In-memory token store.
 *
 * The access token lives in memory (a module-level variable).
 * It's never written to localStorage or cookies — this protects against XSS.
 *
 * On page refresh, the token is lost. The AuthProvider recovers it
 * by calling /api/auth/refresh (which reads the httpOnly refresh token cookie).
 *
 * This is the same pattern used by Auth0, Supabase, and most modern auth libraries.
 */

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
    accessToken = token;
}

export function getAccessToken(): string | null {
    return accessToken;
}

export function clearAccessToken() {
    accessToken = null;
}
