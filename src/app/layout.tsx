import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Journi - Your Daily Journal",
  description: "A simple, minimal journal app for your daily reflections",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="min-h-screen">
          <Sidebar />
          <div className="md:pl-64">
            {children}
          </div>
        </div>
      </ThemeProvider>
    </ClerkProvider>
  );
}
