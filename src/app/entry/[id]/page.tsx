"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Save, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MoodSelector } from "@/components/mood-selector";
import { BottomNav } from "@/components/bottom-nav";

interface Entry {
  id: string;
  title: string | null;
  content: string;
  mood: number;
  createdAt: string;
}

const moods = {
  1: { label: "Terrible", emoji: "😢" },
  2: { label: "Bad", emoji: "😔" },
  3: { label: "Okay", emoji: "😐" },
  4: { label: "Good", emoji: "🙂" },
  5: { label: "Great", emoji: "😊" },
};

export default function EntryPage({ params }: { params: Promise<{ id: string }> }) {
  const [entry, setEntry] = useState<Entry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState(3);
  const [loading, setLoading] = useState(true);
  const [entryId, setEntryId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    params.then(({ id }) => {
      setEntryId(id);
      loadEntry(id);
    });
  }, [params]);

  async function loadEntry(id: string) {
    try {
      const res = await fetch(`/api/entry/${id}`);
      if (res.ok) {
        const data = await res.json();
        setEntry(data);
        setTitle(data.title || "");
        setContent(data.content);
        setMood(data.mood);
      }
    } catch (error) {
      console.error("Failed to load entry:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!content.trim() || !entryId) return;
    
    setIsSaving(true);
    try {
      const res = await fetch(`/api/entry/${entryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, mood }),
      });
      
      if (res.ok) {
        const saved = await res.json();
        setEntry(saved);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!entryId || !confirm("Are you sure you want to delete this entry?")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/entry/${entryId}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        router.push("/past");
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pb-20 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Entry not found</p>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-4">
      <main className="max-w-2xl mx-auto p-4">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-muted-foreground">
            {format(new Date(entry.createdAt), "MMMM d, yyyy")}
          </span>
          <div className="ml-auto flex gap-2">
            {!isEditing && (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={handleDelete} disabled={isDeleting}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Input
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-semibold"
              />
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] resize-none"
              />
              <div className="space-y-2">
                <p className="text-sm font-medium">How are you feeling?</p>
                <MoodSelector value={mood} onChange={setMood} />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  setTitle(entry.title || "");
                  setContent(entry.content);
                  setMood(entry.mood);
                }}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSave} disabled={isSaving || !content.trim()}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              {entry.title && (
                <h2 className="text-xl font-semibold mb-4">{entry.title}</h2>
              )}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{moods[entry.mood as keyof typeof moods].emoji}</span>
                <span className="text-muted-foreground text-sm">
                  Feeling {moods[entry.mood as keyof typeof moods].label.toLowerCase()} at{" "}
                  {format(new Date(entry.createdAt), "h:mm a")}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{entry.content}</p>
            </CardContent>
          </Card>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
