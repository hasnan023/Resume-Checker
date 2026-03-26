import "./globals.css"; // must be in root layout.tsx
import type { Metadata } from "next";
import Sidebar from "@/components/sidebar/sidebar";
import { ThemeProvider } from "@/contexts/theme-context";

export const metadata: Metadata = {
  title: "AI Resume Reader",
  description: "Resume info collector",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider defaultTheme="system">
          <div className="flex min-h-screen">
            {/* Sidebar — fixed on the left */}
            <Sidebar />

            {/* Main content — fills the rest of the screen */}
            <main className="flex-1 min-h-screen overflow-y-auto">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}