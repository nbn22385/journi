"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { PenLine, Save } from "lucide-react";
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
  createdAt: Date;
}

export default function HomePage() {
  const [entry, setEntry] = useState<Entry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodayEntry();
  }, []);

  async function loadTodayEntry() {
    try {
      const res = await fetch("/api/entry/today");
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setEntry(data);
          setTitle(data.title || "");
          setContent(data.content);
          setMood(data.mood);
        }
      }
    } catch (error) {
      console.error("Failed to load entry:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!content.trim()) return;
    
    setIsSaving(true);
    try {
      const url = entry ? `/api/entry/${entry.id}` : "/api/entry";
      const method = entry ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
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

  if (loading) {
    return (
      <div className="min-h-screen pb-20 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-4">
      <main className="max-w-2xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Today</h1>
            <p className="text-muted-foreground">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          {!isEditing && entry && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <PenLine className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        {isEditing || !entry ? (
          <Card>
            <CardContent className="pt-4 space-y-3">
              <Input
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-semibold"
              />
              <Textarea
                placeholder="What's on your mind today?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[150px] resize-none"
              />
              <div className="space-y-2">
                <p className="text-sm font-medium">How are you feeling?</p>
                <MoodSelector value={mood} onChange={setMood} />
              </div>
              <div className="flex gap-2">
                {entry && (
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                )}
                <Button className="flex-1" onClick={handleSave} disabled={isSaving || !content.trim()}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : entry ? "Update Entry" : "Save Entry"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-4">
              {entry.title && (
                <h2 className="text-lg font-semibold mb-2">{entry.title}</h2>
              )}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">
                  {["😢", "😔", "😐", "🙂", "😊"][entry.mood - 1]}
                </span>
                <span className="text-muted-foreground text-sm">
                  {["terrible", "bad", "okay", "good", "great"][entry.mood - 1]} ·{" "}
                  {format(new Date(entry.createdAt), "h:mm a")}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{entry.content}</p>
            </CardContent>
          </Card>
        )}

        {!entry && !isEditing && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Start your journey</p>
            <Button onClick={() => setIsEditing(true)}>
              <PenLine className="h-4 w-4 mr-2" />
              Add Your First Entry
            </Button>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
