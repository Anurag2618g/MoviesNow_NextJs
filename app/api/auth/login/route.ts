import { loginUser } from "@/server/auth/auth.service";
import { NextResponse } from "next/server";

export const POST = async(req: Request) => {
    const body = await req.json();
    if (!body.email || !body.password) {
        return NextResponse.json({error: "Email and password required"}, {status: 400});
    }

    try {
        const user = await loginUser(body.email, body.password);
        return NextResponse.json(user, {status: 200});
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch(err: any) {
        return NextResponse.json({error: err.message}, {status: 400});
    }
};