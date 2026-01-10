import { registerUser } from "@/server/auth/auth.service";
import { getClientKey } from "@/server/security/getClientKey";
import { rateLimit } from "@/server/security/rateLimiter";
import { NextResponse } from "next/server";

export const POST = async(req: Request) => {
    const key = getClientKey(req, "auth:signup");
    const { allowed } = rateLimit(key, {
        windowMs: 60_000,
        max: 5,
    });
    if (!allowed) {
        return NextResponse.json(
            { error: "Too many signups!" },
            { status: 429 },
        );
    }

    const body = await req.json();

    try {
        const user = await registerUser(body.email, body.password);
        return NextResponse.json(user, {status: 201});
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch(err: any) {
        return NextResponse.json({error: err.message}, {status: 400});
    }
};