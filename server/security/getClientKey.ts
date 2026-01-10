export const getClientKey = (req: Request, scope: string) => {
    const ip = req.headers.get("x-forwarded-for")??
        req.headers.get("x-real-ip")??
        "unknown";

    return `${ip}:${scope}`;
};