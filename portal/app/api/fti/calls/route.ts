import { NextResponse } from "next/server";
import { getCalls } from "@/lib/fti/client";

export async function GET() {
  try {
    const data = await getCalls();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        code: "FTI_CALLS_UNAVAILABLE",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 502 }
    );
  }
}
