"use client";

import { useState, useEffect } from "react";
import { User, Moon, Sun, LogOut, BookOpen, PenLine } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BottomNav } from "@/components/bottom-nav";
import { useUser } from "@clerk/nextjs";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);
  const [defaultTemplate, setDefaultTemplate] = useState("free");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadTemplate();
  }, []);

  async function loadTemplate() {
    try {
      const res = await fetch("/api/user/template");
      const data = await res.json();
      setDefaultTemplate(data.template || "free");
    } catch (error) {
      console.error("Failed to load template:", error);
    }
  }

  async function handleTemplateChange(value: string) {
    setSaving(true);
    try {
      const res = await fetch("/api/user/template", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: value }),
      });
      if (res.ok) {
        setDefaultTemplate(value);
      }
    } catch (error) {
      console.error("Failed to save template:", error);
    } finally {
      setSaving(false);
    }
  }

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen pb-20 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-4">
      <main className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="space-y-2">
                  <p className="font-medium">{user.fullName || "User"}</p>
                  <p className="text-sm text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">Not signed in</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <PenLine className="h-4 w-4" />
                Journal Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={defaultTemplate}
                onValueChange={handleTemplateChange}
                className="space-y-3"
                disabled={saving}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="free" id="free" />
                  <Label htmlFor="free" className="cursor-pointer">
                    <span className="font-medium">Free Write</span>
                    <span className="text-muted-foreground text-sm ml-2">
                      - Write whatever is on your mind
                    </span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5min" id="5min" />
                  <Label htmlFor="5min" className="cursor-pointer">
                    <span className="font-medium">5-Minute Journal</span>
                    <span className="text-muted-foreground text-sm ml-2">
                      - Structured gratitude & reflection
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Appearance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span>Theme</span>
                <div className="flex gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("system")}
                  >
                    System
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => window.location.href = "/sign-out"}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
