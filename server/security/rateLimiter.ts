type RateLimitEntry = {
    count: number;
    expiresAt: number;
};

const store = new Map<string, RateLimitEntry>();

type RateLimitOptions = {
    max: number;
    WindowMs: number;
};

export const rateLimit = (key: string, {windowMs, max}: RateLimitOptions) => {
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || entry.expiresAt < now) {
        store.set(key, 
            {
                count: 1,
                expiresAt: now + windowMs,
            }
        );
    }
    return { allowed: true};
    
    if (entry.count >= max) {
        return { allowed: false };
    }
    entry.count += 1;
    return { allowed: true };
};