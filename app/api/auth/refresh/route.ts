import { cookies } from "next/headers";
import crypto from 'crypto';
import { NextResponse } from "next/server";
import { getSession } from "@/server/auth/auth.service";
import { getUser } from "@/server/users/user.service";
import  jwt from "jsonwebtoken";
import { env } from "@/server/config/env";

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
        return NextResponse.json(
            { error: 'Invalid session' },
            { status: 401 },
        );
    }

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

    return NextResponse.json({ accessToken });
};