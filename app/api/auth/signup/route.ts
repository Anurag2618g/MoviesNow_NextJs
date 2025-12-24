import { registerUser } from "@/server/auth/auth.service";
import { NextResponse } from "next/server";

export const POST = async(req: Request) => {
    const body = await req.json();

    try {
        const user = await registerUser(body.email, body.password);
        return NextResponse.json(user, {status: 201});
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch(error: any) {
        return NextResponse.json({error: error.message}, {status: 400});
    }
};