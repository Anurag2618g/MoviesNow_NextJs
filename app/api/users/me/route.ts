import { getCurrentUser } from "@/server/users/user.service";
import { NextResponse } from "next/server";

export const GET = async(req: Request) => {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 },
        );
    }
    try {
        const user = await getCurrentUser(userId);
        return NextResponse.json(user);
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: 404 },
        );
    }
};