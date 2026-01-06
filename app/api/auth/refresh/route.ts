import { cookies } from "next/headers";
import crypto from 'crypto';
import { NextResponse } from "next/server";
import { createSession, deleteSessionById, getSession } from "@/server/auth/auth.service";
import { getUser } from "@/server/users/user.service";
import  jwt from "jsonwebtoken";
import { env } from "@/server/config/env";
import { logAuthEvent } from "@/server/auth/auth.logger";

export const POST = async() => {
    const refreshToken = (await cookies()).get('refreshToken')?.value;
    if (!refreshToken) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 },
        );
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await getSession(refreshTokenHash);
    if (!session) {
        logAuthEvent("SESSION_REUSE_DETECTED", { refreshTokenHash });
        return NextResponse.json(
            { error: 'Invalid session' },
            { status: 401 },
        );
    }

    await deleteSessionById(session._id);
    const newRefreshToken = crypto.randomBytes(64).toString("hex");
    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
    await createSession(newRefreshTokenHash, session._id);

    const user = await getUser(session.userId);
    if (!user) {
        return NextResponse.json(
            { error: 'User not found' },
            { status: 401 },
        );
    }

    const accessToken = jwt.sign(
        { sub: user._id.toString(), role: user.role },
        env.JWT_SECRET,
        { expiresIn: '15min' },
    );

    const res = NextResponse.json({ accessToken });
    res.cookies.set('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: '/api/auth/refresh',
    });

    return res;
};