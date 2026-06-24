import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { CopilotProvider } from "@/components/copilot/copilot-provider";
import { InterviewCopilot } from "@/components/copilot/interview-copilot";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: { default: "InterviewAI — AI-Powered Interview Platform", template: "%s | InterviewAI" },
  description: "Conduct technical, behavioral and coding interviews with AI-generated questions and real-time evaluation.",
  keywords: ["AI interview", "technical interview", "coding interview", "interview practice", "hiring platform"],
  openGraph: {
    type: "website",
    title: "InterviewAI",
    description: "AI-Powered Interview Platform for Modern Hiring",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "InterviewAI", description: "AI-Powered Interview Platform" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#040d21" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CopilotProvider>
            {children}
            <InterviewCopilot />
            <Toaster richColors position="top-right" />
          </CopilotProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}