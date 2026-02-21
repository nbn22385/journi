import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const template = body.template || 'free';

    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { defaultTemplate: template },
    });

    return NextResponse.json({ success: true, template });
  } catch (error) {
    console.error("Failed to update user template:", error);
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ template: "free" });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const template = user.publicMetadata?.defaultTemplate as string || "free";

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Failed to get user template:", error);
    return NextResponse.json({ template: "free" });
  }
}
