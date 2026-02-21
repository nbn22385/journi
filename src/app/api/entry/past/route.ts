import { NextResponse } from "next/server";
import { getPastEntries } from "@/lib/actions";

export async function GET() {
  try {
    const entries = await getPastEntries(100);
    return NextResponse.json(entries);
  } catch (error) {
    console.error("Failed to get past entries:", error);
    return NextResponse.json({ error: "Failed to get entries" }, { status: 500 });
  }
}
