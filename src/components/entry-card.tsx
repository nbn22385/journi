import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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
    mood: number;
    createdAt: Date;
  };
}

export function EntryCard({ entry }: EntryCardProps) {
  const mood = moods[entry.mood as keyof typeof moods];

  return (
    <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {format(new Date(entry.createdAt), "h:mm a")}
          </span>
          <Badge variant="outline" className="gap-1">
            <span>{mood.emoji}</span>
            <span>{mood.label}</span>
          </Badge>
        </div>
        {entry.title && (
          <h3 className="font-semibold">{entry.title}</h3>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {entry.content}
        </p>
      </CardContent>
    </Card>
  );
}
