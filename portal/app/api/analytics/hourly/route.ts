import { NextRequest, NextResponse } from "next/server";
import { getHourlyMetrics } from "@/lib/analytics/client";

export async function GET(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? "24");

  try {
    const items = await getHourlyMetrics(limit);
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      {
        code: "ANALYTICS_UNAVAILABLE",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 502 }
    );
  }
}
