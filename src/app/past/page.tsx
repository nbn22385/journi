"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EntryCard } from "@/components/entry-card";
import { BottomNav } from "@/components/bottom-nav";

interface Entry {
  id: string;
  title: string | null;
  content: string;
  mood: number;
  createdAt: string;
}

export default function PastPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    try {
      const res = await fetch("/api/entry/past");
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
        if (data.length > 0) {
          const firstDate = parseISO(data[0].createdAt);
          setSelectedMonth(format(firstDate, "yyyy-MM"));
        }
      }
    } catch (error) {
      console.error("Failed to load entries:", error);
    } finally {
      setLoading(false);
    }
  }

  const groupedEntries = entries.reduce((acc, entry) => {
    const monthKey = format(parseISO(entry.createdAt), "yyyy-MM");
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(entry);
    return acc;
  }, {} as Record<string, Entry[]>);

  const months = Object.keys(groupedEntries).sort((a, b) => b.localeCompare(a));

  function changeMonth(direction: "prev" | "next") {
    if (!selectedMonth) return;
    const currentIndex = months.indexOf(selectedMonth);
    if (direction === "prev" && currentIndex < months.length - 1) {
      setSelectedMonth(months[currentIndex + 1]);
    } else if (direction === "next" && currentIndex > 0) {
      setSelectedMonth(months[currentIndex - 1]);
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
        <h1 className="text-2xl font-bold mb-6">Past Entries</h1>

        {entries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No past entries yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start writing today to build your history
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => changeMonth("prev")}
                disabled={months.indexOf(selectedMonth || "") === months.length - 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">
                {selectedMonth && format(parseISO(selectedMonth + "-01"), "MMMM yyyy")}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => changeMonth("next")}
                disabled={months.indexOf(selectedMonth || "") === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {selectedMonth && groupedEntries[selectedMonth]?.map((entry) => (
              <div
                key={entry.id}
                className="mb-3"
                onClick={() => router.push(`/entry/${entry.id}`)}
              >
                <EntryCard
                  entry={{
                    ...entry,
                    createdAt: parseISO(entry.createdAt),
                  }}
                />
              </div>
            ))}
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
