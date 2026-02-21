"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EntryCard } from "@/components/entry-card";
import { BottomNav } from "@/components/bottom-nav";

interface Entry {
  id: string;
  title: string | null;
  content: string;
  mood: number;
  createdAt: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      searchEntries(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  async function searchEntries(searchQuery: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/entry/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pb-24 md:pb-4">
      <main className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Search</h1>
        
        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your entries..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Searching...</div>
        ) : query && results.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No entries found for "{query}"
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-3">
            {results.map((entry) => (
              <div
                key={entry.id}
                onClick={() => router.push(`/entry/${entry.id}`)}
              >
                <EntryCard
                  entry={{
                    ...entry,
                    createdAt: new Date(entry.createdAt),
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Start typing to search your journal
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
