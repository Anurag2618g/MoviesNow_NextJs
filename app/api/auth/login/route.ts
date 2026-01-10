import { loginUser } from "@/server/auth/auth.service";
import { getClientKey } from "@/server/security/getClientKey";
import { rateLimit } from "@/server/security/rateLimiter";
import { NextResponse } from "next/server";

export const POST = async(req: Request) => {
    const key = getClientKey(req, "auth:login");
    const { allowed } = rateLimit(key, {
        windowMs: 60_000,
        max: 5,
    });
    if (!allowed) {
        return NextResponse.json(
            { error: "Too many login attempts" },
            { status: 429 },
        );
    }

    const body = await req.json();
    if (!body.email || !body.password) {
        return NextResponse.json({error: "Email and password required"}, {status: 400});
    }

    try {
        const { accessToken, refreshToken } = await loginUser(body.email, body.password);
        const res =  NextResponse.json(accessToken, {status: 200});
        res.cookies.set('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            path: '/api/auth/refresh'
        });

        return res;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch(err: any) {
        return NextResponse.json({error: err.message}, {status: 400});
    }
};