"use server";

import { db } from "@/lib/db";
import { entries } from "@/lib/schema";
import { eq, desc, asc, sql, like, or } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getTodayEntry() {
  const { userId } = await auth();
  if (!userId) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const result = await db
    .select()
    .from(entries)
    .where(
      sql`${entries.userId} = ${userId} AND ${entries.createdAt} >= ${today} AND ${entries.createdAt} < ${tomorrow}`
    )
    .limit(1);

  return result[0] || null;
}

export async function getEntryById(id: string) {
  const { userId } = await auth();
  if (!userId) return null;

  const result = await db
    .select()
    .from(entries)
    .where(sql`${entries.id} = ${id} AND ${entries.userId} = ${userId}`)
    .limit(1);

  return result[0] || null;
}

export async function getPastEntries(limit = 50, offset = 0) {
  const { userId } = await auth();
  if (!userId) return [];

  const result = await db
    .select()
    .from(entries)
    .where(eq(entries.userId, userId))
    .orderBy(desc(entries.createdAt))
    .limit(limit)
    .offset(offset);

  return result;
}

export async function searchEntries(query: string) {
  const { userId } = await auth();
  if (!userId || !query.trim()) return [];

  const searchTerm = `%${query}%`;
  const result = await db
    .select()
    .from(entries)
    .where(
      sql`${entries.userId} = ${userId} AND (${entries.content} ILIKE ${searchTerm} OR ${entries.title} ILIKE ${searchTerm})`
    )
    .orderBy(desc(entries.createdAt))
    .limit(20);

  return result;
}

export async function createEntry(data: {
  title?: string;
  content: string;
  mood: number;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const result = await db
    .insert(entries)
    .values({
      userId,
      title: data.title || null,
      content: data.content,
      mood: data.mood,
    })
    .returning();

  revalidatePath("/");
  revalidatePath("/past");
  return result[0];
}

export async function updateEntry(
  id: string,
  data: {
    title?: string;
    content: string;
    mood: number;
  }
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const result = await db
    .update(entries)
    .set({
      title: data.title || null,
      content: data.content,
      mood: data.mood,
      updatedAt: new Date(),
    })
    .where(sql`${entries.id} = ${id} AND ${entries.userId} = ${userId}`)
    .returning();

  revalidatePath("/");
  revalidatePath("/past");
  revalidatePath(`/entry/${id}`);
  return result[0];
}

export async function deleteEntry(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db
    .delete(entries)
    .where(sql`${entries.id} = ${id} AND ${entries.userId} = ${userId}`);

  revalidatePath("/");
  revalidatePath("/past");
}

export async function getInsights(days = 30) {
  const { userId } = await auth();
  if (!userId) return null;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const result = await db
    .select({
      id: entries.id,
      mood: entries.mood,
      content: entries.content,
      createdAt: entries.createdAt,
    })
    .from(entries)
    .where(sql`${entries.userId} = ${userId} AND ${entries.createdAt} >= ${startDate}`)
    .orderBy(asc(entries.createdAt));

  return result;
}
