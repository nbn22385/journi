"use client";

import { cn } from "@/lib/utils";

const moods = [
  { value: 1, label: "Terrible", emoji: "😢" },
  { value: 2, label: "Bad", emoji: "😔" },
  { value: 3, label: "Okay", emoji: "😐" },
  { value: 4, label: "Good", emoji: "🙂" },
  { value: 5, label: "Great", emoji: "😊" },
];

interface MoodSelectorProps {
  value: number;
  onChange: (mood: number) => void;
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {moods.map((mood) => (
        <button
          key={mood.value}
          type="button"
          onClick={() => onChange(mood.value)}
          className={cn(
            "flex flex-col items-center gap-1 rounded-lg p-2 transition-all hover:scale-110",
            value === mood.value
              ? "bg-primary/20 ring-2 ring-primary"
              : "hover:bg-muted"
          )}
        >
          <span className="text-2xl">{mood.emoji}</span>
          <span className="text-xs text-muted-foreground">{mood.label}</span>
        </button>
      ))}
    </div>
  );
}
