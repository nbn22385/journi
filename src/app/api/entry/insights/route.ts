import { NextResponse } from "next/server";
import { getInsights } from "@/lib/actions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30", 10);
    
    const entries = await getInsights(days);
    return NextResponse.json(entries || []);
  } catch (error) {
    console.error("Failed to get insights:", error);
    return NextResponse.json({ error: "Failed to get insights" }, { status: 500 });
  }
}
