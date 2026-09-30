import { NextResponse } from "next/server";
import { getRevenueAssurance } from "@/lib/fti/client";

export async function GET() {
  try {
    const data = await getRevenueAssurance();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        code: "FTI_RA_UNAVAILABLE",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 502 }
    );
  }
}
