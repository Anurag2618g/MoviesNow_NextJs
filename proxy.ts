import jwt from 'jsonwebtoken';
import { env } from './infrastructure/config/env';
import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    try {
        const payload = jwt.verify(token, env.JWT_SECRET) as {
            id: string;
            role: string;
        };

        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('x-user-id', payload.id);
        requestHeaders.set('x-user-role', payload.role ?? 'user');

        return NextResponse.next({
            request: { headers: requestHeaders },
        });
    } catch {
        return NextResponse.json(
            { error: 'Invalid or expired token' },
            { status: 401 }
        );
    }
}

export const config = {
    matcher: [
        '/api/users/:path*',
        '/api/admin/:path*',
        '/api/watch/:path*',
        '/api/discovery/:path*',
    ],
};
