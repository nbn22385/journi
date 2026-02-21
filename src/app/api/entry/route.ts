import { NextResponse } from "next/server";
import { createEntry, getEntryById, updateEntry, deleteEntry } from "@/lib/actions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const entry = await createEntry({
      title: body.title,
      content: body.content,
      mood: body.mood,
    });
    return NextResponse.json(entry);
  } catch (error) {
    console.error("Failed to create entry:", error);
    return NextResponse.json({ error: "Failed to create entry" }, { status: 500 });
  }
}
