import { getUserAnalytics } from "@/server/analytics/analytics.query";
import { NextResponse } from "next/server";

// GET /api/users/analytics — returns watch analytics for the logged-in user
export const GET = async (req: Request) => {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const analytics = await getUserAnalytics(userId);
        return NextResponse.json(analytics);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
};
