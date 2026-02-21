"use client";

import { useState, useEffect, useMemo } from "react";
import { format, parseISO, differenceInDays, isYesterday, isToday } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { TrendingUp, Calendar, FileText, Smile } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNav } from "@/components/bottom-nav";

interface Entry {
  id: string;
  mood: number;
  content: string;
  createdAt: string;
}

const moodEmojis = ["😢", "😔", "😐", "🙂", "😊"];
const moodLabels = ["Terrible", "Bad", "Okay", "Good", "Great"];
const moodColors = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];

export default function InsightsPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    loadInsights();
  }, [days]);

  async function loadInsights() {
    setLoading(true);
    try {
      const res = await fetch(`/api/entry/insights?days=${days}`);
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (error) {
      console.error("Failed to load insights:", error);
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    if (entries.length === 0) {
      return { averageMood: 0, streak: 0, totalEntries: 0, trend: "neutral" };
    }

    const totalMood = entries.reduce((sum, e) => sum + e.mood, 0);
    const averageMood = totalMood / entries.length;

    let streak = 0;
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let checkDate = today;
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.createdAt);
      entryDate.setHours(0, 0, 0, 0);

      if (entryDate.getTime() === checkDate.getTime() || 
          (streak === 0 && (isToday(entryDate) || isYesterday(entryDate)))) {
        streak++;
        checkDate = new Date(checkDate);
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (entryDate.getTime() < checkDate.getTime()) {
        break;
      }
    }

    const halfPoint = Math.floor(entries.length / 2);
    const firstHalf = entries.slice(0, halfPoint).reduce((sum, e) => sum + e.mood, 0) / (halfPoint || 1);
    const secondHalf = entries.slice(halfPoint).reduce((sum, e) => sum + e.mood, 0) / (entries.length - halfPoint || 1);
    
    let trend = "stable";
    if (secondHalf > firstHalf + 0.3) trend = "up";
    else if (secondHalf < firstHalf - 0.3) trend = "down";

    return {
      averageMood: Math.round(averageMood * 10) / 10,
      streak,
      totalEntries: entries.length,
      trend,
    };
  }, [entries]);

  const chartData = useMemo(() => {
    return entries.map((entry) => ({
      date: format(parseISO(entry.createdAt), "MMM d"),
      mood: entry.mood,
      fullDate: entry.createdAt,
    }));
  }, [entries]);

  const distributionData = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    entries.forEach((e) => {
      counts[e.mood - 1]++;
    });
    return counts.map((count, i) => ({
      mood: moodEmojis[i],
      count,
      label: moodLabels[i],
    }));
  }, [entries]);

  if (loading) {
    return (
      <div className="min-h-screen pb-20 flex items-center justify-center">
        <div className="animate-pulse">Loading insights...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-4">
      <main className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Insights</h1>

        <div className="flex gap-2 mb-6">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                days === d
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {d} days
            </button>
          ))}
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No entries yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start writing to see your mood analytics
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <Card>
                <CardContent className="pt-4 text-center">
                  <Smile className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">{stats.averageMood}</div>
                  <div className="text-xs text-muted-foreground">Avg Mood</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <TrendingUp className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">{stats.streak}</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <FileText className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">{stats.totalEntries}</div>
                  <div className="text-xs text-muted-foreground">Entries</div>
                </CardContent>
              </Card>
            </div>

            {stats.trend !== "stable" && (
              <div className={`mb-6 p-3 rounded-lg text-center text-sm ${
                stats.trend === "up" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
              }`}>
                Your mood has been {stats.trend === "up" ? "improving" : "declining"} 📈
              </div>
            )}

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Mood Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: "hsl(var(--muted))" }}
                      />
                      <YAxis 
                        domain={[1, 5]} 
                        ticks={[1, 2, 3, 4, 5]}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: "hsl(var(--muted))" }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border rounded-lg p-2 shadow-md">
                                <p className="text-sm font-medium">{data.date}</p>
                                <p className="text-sm text-muted-foreground">
                                  {moodEmojis[data.mood - 1]} {moodLabels[data.mood - 1]}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="mood"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Mood Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distributionData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis 
                        type="category" 
                        dataKey="mood" 
                        width={40}
                        tick={false}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border rounded-lg p-2 shadow-md">
                                <p className="text-sm font-medium">{data.label}</p>
                                <p className="text-sm text-muted-foreground">{data.count} entries</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={moodColors[index]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
