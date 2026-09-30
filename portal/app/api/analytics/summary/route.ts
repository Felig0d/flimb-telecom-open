import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/lib/analytics/client";

export async function GET(request: NextRequest) {
  const windowMinutes = Number(request.nextUrl.searchParams.get("window") ?? "60");

  try {
    const data = await getAnalyticsSummary(windowMinutes);
    return NextResponse.json(data);
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
