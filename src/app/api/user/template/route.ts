import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const template = body.template || 'free';

    const response = await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
      body: JSON.stringify({
        public_metadata: {
          defaultTemplate: template,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update metadata");
    }

    return NextResponse.json({ success: true, template });
  } catch (error) {
    console.error("Failed to update user template:", error);
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
  }
}
