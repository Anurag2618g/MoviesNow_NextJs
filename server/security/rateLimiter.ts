type RateLimitEntry = {
    count: number;
    expiresAt: number;
};

const store = new Map<string, RateLimitEntry>();

type RateLimitOptions = {
    max: number;
    windowMs: number;
};

export const rateLimit = (key: string, {windowMs, max}: RateLimitOptions) => {
    const entry = store.get(key);

    if (!entry || entry.expiresAt < Date.now()) {
        store.set(key,{
            count: 1,
            expiresAt: Date.now() + windowMs,
        });
        return { allowed: true};
    }

    if (entry.count >= max) {
        return { allowed: false};
    }

    entry.count += 1;
    return { allowed: true};
};