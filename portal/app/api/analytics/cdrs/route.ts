import { NextRequest, NextResponse } from "next/server";

const baseUrl = (process.env.ANALYTICS_API_BASE_URL ?? "http://127.0.0.1:8086").replace(/\/$/, "");

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams.toString();

  try {
    const response = await fetch(`${baseUrl}/v1/cdrs${params ? `?${params}` : ""}`, {
      cache: "no-store",
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      throw new Error(`Analytics API returned HTTP ${response.status}`);
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    return NextResponse.json(
      {
        code: "ANALYTICS_CDRS_UNAVAILABLE",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 502 }
    );
  }
}
