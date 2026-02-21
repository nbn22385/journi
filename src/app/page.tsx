"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { PenLine, Save, Sparkles } from "lucide-react";
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
  createdAt: Date;
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

function parseFiveMinContent(content: string): FiveMinJournal {
  try {
    return JSON.parse(content);
  } catch {
    return defaultFiveMinJournal;
  }
}

function FreeWriteEditor({
  content,
  onChange,
  title,
  onTitleChange,
}: {
  content: string;
  onChange: (value: string) => void;
  title: string;
  onTitleChange: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <Input
        placeholder="Title (optional)"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="font-semibold"
      />
      <Textarea
        placeholder="What's on your mind today?"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[150px] resize-none"
      />
    </div>
  );
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

function FreeWriteView({ content, title }: { content: string; title: string | null }) {
  return (
    <div>
      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
      <p className="whitespace-pre-wrap">{content}</p>
    </div>
  );
}

function FiveMinJournalView({ content }: { content: string }) {
  const data = parseFiveMinContent(content);

  return (
    <div className="space-y-6">
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

export default function HomePage() {
  const [entry, setEntry] = useState<Entry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState(3);
  const [template, setTemplate] = useState("free");
  const [fiveMinData, setFiveMinData] = useState<FiveMinJournal>(defaultFiveMinJournal);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodayEntry();
    loadTemplate();
  }, []);

  async function loadTemplate() {
    try {
      const res = await fetch("/api/user/template");
      const data = await res.json();
      setTemplate(data.template || "free");
    } catch (error) {
      console.error("Failed to load template:", error);
    }
  }

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
          setTemplate(data.template || "free");
          if (data.template === "5min") {
            setFiveMinData(parseFiveMinContent(data.content));
          }
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
    
    if (!finalContent.trim()) return;
    
    setIsSaving(true);
    try {
      const url = entry ? `/api/entry/${entry.id}` : "/api/entry";
      const method = entry ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
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
          <div className="flex items-center gap-2">
            {template === "5min" && (
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                5-Min
              </Badge>
            )}
            {!isEditing && entry && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <PenLine className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>

        {isEditing || !entry ? (
          <Card>
            <CardContent className="pt-4 space-y-4">
              {template === "free" ? (
                <FreeWriteEditor
                  content={content}
                  onChange={setContent}
                  title={title}
                  onTitleChange={setTitle}
                />
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
                {entry && (
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
                )}
                <Button 
                  className="flex-1" 
                  onClick={handleSave} 
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : entry ? "Update Entry" : "Save Entry"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">
                  {["😢", "😔", "😐", "🙂", "😊"][entry.mood - 1]}
                </span>
                <span className="text-muted-foreground text-sm">
                  {["terrible", "bad", "okay", "good", "great"][entry.mood - 1]} ·{" "}
                  {format(new Date(entry.createdAt), "h:mm a")}
                </span>
              </div>
              {template === "free" ? (
                <FreeWriteView content={entry.content} title={entry.title} />
              ) : (
                <FiveMinJournalView content={entry.content} />
              )}
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
