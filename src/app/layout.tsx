import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { ThemeProvider } from "@/components/theme-provider"
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
        <html lang="en">
          <body className="antialiased">
            {children}
          </body>
        </html>
      </ThemeProvider>
    </ClerkProvider>
  );
}
