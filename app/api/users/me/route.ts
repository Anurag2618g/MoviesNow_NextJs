import { connectDB } from "@/server/db/mongo";
import { NextResponse } from "next/server";
import User from "@/server/users/user.model";

export const GET = async(req: Request) => {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 },
        );
    }

    await connectDB();

    const user = await User.findById(userId).select("-passwordHash");
    if (!user) {
        return NextResponse.json(
            { error: 'User not found' },
            { status: 401 },
        );
    }

    return NextResponse.json({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        lastLoggedIn: user.lastLoggedIn,
    });
};