import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Sparkles } from "lucide-react";

const moods = {
  1: { label: "Terrible", emoji: "😢" },
  2: { label: "Bad", emoji: "😔" },
  3: { label: "Okay", emoji: "😐" },
  4: { label: "Good", emoji: "🙂" },
  5: { label: "Great", emoji: "😊" },
};

interface EntryCardProps {
  entry: {
    id: string;
    title: string | null;
    content: string;
    template: string;
    mood: number;
    createdAt: Date;
  };
}

function parseFiveMinContent(content: string): { gratitude: string[]; highlights: string[] } {
  try {
    const data = JSON.parse(content);
    return {
      gratitude: data.gratitude || [],
      highlights: data.highlights || [],
    };
  } catch {
    return { gratitude: [], highlights: [] };
  }
}

export function EntryCard({ entry }: EntryCardProps) {
  const mood = moods[entry.mood as keyof typeof moods];
  const isFiveMin = entry.template === "5min";
  
  let contentPreview = entry.content;
  if (isFiveMin) {
    const data = parseFiveMinContent(entry.content);
    const parts = [
      ...data.gratitude.filter(Boolean).slice(0, 2),
      ...data.highlights.filter(Boolean).slice(0, 2),
    ];
    contentPreview = parts.join(" · ") || "5-Minute Journal entry";
  }

  return (
    <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {format(new Date(entry.createdAt), "MMM d, h:mm a")}
            </span>
            {isFiveMin && (
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                5-Min
              </Badge>
            )}
          </div>
          <Badge variant="outline" className="gap-1">
            <span>{mood.emoji}</span>
          </Badge>
        </div>
        {entry.title && (
          <h3 className="font-semibold">{entry.title}</h3>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {contentPreview}
        </p>
      </CardContent>
    </Card>
  );
}
