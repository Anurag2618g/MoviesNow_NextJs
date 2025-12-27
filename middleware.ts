import jwt from 'jsonwebtoken';
import { env } from './server/config/env';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const middleware = (req: NextRequest) => {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json(
            {
                error: 'Unauthorized',
                status: 401,
            }
        );
    }
    const token = authHeader.replace("Bearer ", "");

    try {
        const payload = jwt.verify(token, env.JWT_SECRET) as {
            sub: string,
            role: string,
        };
        
        req.headers.set('x-user-id', payload.sub);
        req.headers.set('x-user-role', payload.role);

        return NextResponse.next();
    }
    catch {
        return NextResponse.json(
            {
                error: 'Invalid token',
                status: 401,
            }
        );
    }
};

export const config = { matcher: ['/api/user/:path*', '/api/content/:path*']};