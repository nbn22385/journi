"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Save, Trash2, Pencil, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MoodSelector } from "@/components/mood-selector";
import { BottomNav } from "@/components/bottom-nav";
import { Badge } from "@/components/ui/badge";

interface Entry {
  id: string;
  title: string | null;
  content: string;
  template: string;
  mood: number;
  createdAt: string;
}

interface FiveMinJournal {
  gratitude: string[];
  intentions: string[];
  affirmations: string;
  highlights: string[];
  improvement: string;
}

const defaultFiveMinJournal: FiveMinJournal = {
  gratitude: ["", "", ""],
  intentions: ["", "", ""],
  affirmations: "",
  highlights: ["", "", ""],
  improvement: "",
};

const moods = {
  1: { label: "Terrible", emoji: "😢" },
  2: { label: "Bad", emoji: "😔" },
  3: { label: "Okay", emoji: "😐" },
  4: { label: "Good", emoji: "🙂" },
  5: { label: "Great", emoji: "😊" },
};

function parseFiveMinContent(content: string): FiveMinJournal {
  try {
    return JSON.parse(content);
  } catch {
    return defaultFiveMinJournal;
  }
}

function FiveMinJournalEditor({
  data,
  onChange,
}: {
  data: FiveMinJournal;
  onChange: (data: FiveMinJournal) => void;
}) {
  const updateGratitude = (index: number, value: string) => {
    const newGratitude = [...data.gratitude];
    newGratitude[index] = value;
    onChange({ ...data, gratitude: newGratitude });
  };

  const updateIntentions = (index: number, value: string) => {
    const newIntentions = [...data.intentions];
    newIntentions[index] = value;
    onChange({ ...data, intentions: newIntentions });
  };

  const updateHighlights = (index: number, value: string) => {
    const newHighlights = [...data.highlights];
    newHighlights[index] = value;
    onChange({ ...data, highlights: newHighlights });
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Morning - Gratitude
        </h3>
        <div className="space-y-2">
          {data.gratitude.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
              <Input
                placeholder="I'm grateful for..."
                value={item}
                onChange={(e) => updateGratitude(i, e.target.value)}
                className="flex-1"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Morning - Intentions
        </h3>
        <div className="space-y-2">
          {data.intentions.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
              <Input
                placeholder="Today will be great if..."
                value={item}
                onChange={(e) => updateIntentions(i, e.target.value)}
                className="flex-1"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Morning - Affirmations
        </h3>
        <Textarea
          placeholder="I am..."
          value={data.affirmations}
          onChange={(e) => onChange({ ...data, affirmations: e.target.value })}
          className="min-h-[80px]"
        />
      </div>

      <div className="bg-muted/50 rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Evening - Highlights
        </h3>
        <div className="space-y-2">
          {data.highlights.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
              <Input
                placeholder="An amazing moment was..."
                value={item}
                onChange={(e) => updateHighlights(i, e.target.value)}
                className="flex-1"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Evening - Improvement
        </h3>
        <Textarea
          placeholder="I could have made today better by..."
          value={data.improvement}
          onChange={(e) => onChange({ ...data, improvement: e.target.value })}
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
}

function FiveMinJournalView({ content }: { content: string }) {
  const data = parseFiveMinContent(content);

  return (
    <div className="space-y-6">
      {data.gratitude.filter(Boolean).length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Gratitude
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {data.gratitude.filter(Boolean).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {data.intentions.filter(Boolean).length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Intentions
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {data.intentions.filter(Boolean).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {data.affirmations && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Affirmations
          </h3>
          <p className="whitespace-pre-wrap">{data.affirmations}</p>
        </div>
      )}

      {data.highlights.filter(Boolean).length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Highlights
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {data.highlights.filter(Boolean).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {data.improvement && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Improvement
          </h3>
          <p className="whitespace-pre-wrap">{data.improvement}</p>
        </div>
      )}
    </div>
  );
}

export default function EntryPage({ params }: { params: Promise<{ id: string }> }) {
  const [entry, setEntry] = useState<Entry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState(3);
  const [template, setTemplate] = useState("free");
  const [fiveMinData, setFiveMinData] = useState<FiveMinJournal>(defaultFiveMinJournal);
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
        setTemplate(data.template || "free");
        if (data.template === "5min") {
          setFiveMinData(parseFiveMinContent(data.content));
        }
      }
    } catch (error) {
      console.error("Failed to load entry:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    const finalContent = template === "5min" 
      ? JSON.stringify(fiveMinData) 
      : content;
    
    if (!finalContent.trim() || !entryId) return;
    
    setIsSaving(true);
    try {
      const res = await fetch(`/api/entry/${entryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content: finalContent, mood, template }),
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

  const isFiveMin = template === "5min";

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
          {isFiveMin && (
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              5-Min
            </Badge>
          )}
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
              {template === "free" ? (
                <>
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
                </>
              ) : (
                <FiveMinJournalEditor
                  data={fiveMinData}
                  onChange={setFiveMinData}
                />
              )}
              <div className="space-y-2">
                <p className="text-sm font-medium">How are you feeling?</p>
                <MoodSelector value={mood} onChange={setMood} />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  if (entry.template === "5min") {
                    setFiveMinData(parseFiveMinContent(entry.content));
                  } else {
                    setTitle(entry.title || "");
                    setContent(entry.content);
                  }
                  setMood(entry.mood);
                }}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{moods[entry.mood as keyof typeof moods].emoji}</span>
                <span className="text-muted-foreground text-sm">
                  {moods[entry.mood as keyof typeof moods].label} ·{" "}
                  {format(new Date(entry.createdAt), "h:mm a")}
                </span>
              </div>
              {template === "free" ? (
                <>
                  {entry.title && (
                    <h2 className="text-xl font-semibold mb-4">{entry.title}</h2>
                  )}
                  <p className="whitespace-pre-wrap">{entry.content}</p>
                </>
              ) : (
                <FiveMinJournalView content={entry.content} />
              )}
            </CardContent>
          </Card>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
