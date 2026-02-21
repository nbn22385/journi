import { NextResponse } from "next/server";
import { getEntryById, updateEntry, deleteEntry } from "@/lib/actions";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const entry = await getEntryById(id);
    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }
    return NextResponse.json(entry);
  } catch (error) {
    console.error("Failed to get entry:", error);
    return NextResponse.json({ error: "Failed to get entry" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const entry = await updateEntry(id, {
      title: body.title,
      content: body.content,
      mood: body.mood,
    });
    return NextResponse.json(entry);
  } catch (error) {
    console.error("Failed to update entry:", error);
    return NextResponse.json({ error: "Failed to update entry" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteEntry(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete entry:", error);
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 });
  }
}
