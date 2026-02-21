import { NextResponse } from "next/server";
import { getTodayEntry } from "@/lib/actions";

export async function GET() {
  try {
    const entry = await getTodayEntry();
    return NextResponse.json(entry);
  } catch (error) {
    console.error("Failed to get today's entry:", error);
    return NextResponse.json({ error: "Failed to get entry" }, { status: 500 });
  }
}
