import { deleteSession } from "@/server/auth/auth.service";
import crypto from 'crypto';
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async() => {
    const refreshToken = (await cookies()).get('refreshToken')?.value;
    if (!refreshToken) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    await deleteSession(refreshTokenHash);

    const res = NextResponse.json({ success: true });
    res.cookies.delete('refreshToken');
    return res;
};