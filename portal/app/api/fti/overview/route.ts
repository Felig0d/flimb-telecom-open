import { NextResponse } from "next/server";
import { getOverview } from "@/lib/fti/client";

export async function GET() {
  try {
    const data = await getOverview();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        code: "FTI_OVERVIEW_UNAVAILABLE",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 502 }
    );
  }
}
