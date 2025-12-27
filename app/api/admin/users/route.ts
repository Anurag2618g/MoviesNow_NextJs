import { getAllUsers } from "@/server/users/user.service";
import { NextResponse } from "next/server";

export const GET = async(req: Request) => {
    const role = req.headers.get('x-user-role');
    if (role !== 'admin') {
        return NextResponse.json(
            { error: 'Forbidden' },
            { status: 403 },
        );
    }

    const users = await getAllUsers();

    return NextResponse.json(users);
};