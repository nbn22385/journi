import { NextResponse } from "next/server";
import { searchEntries } from "@/lib/actions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    
    if (!query) {
      return NextResponse.json([]);
    }
    
    const entries = await searchEntries(query);
    return NextResponse.json(entries);
  } catch (error) {
    console.error("Search failed:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
