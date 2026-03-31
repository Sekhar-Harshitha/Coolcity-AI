import "./globals.css";
import "../styles/tokens.css";
import "../styles/animations.css";
import { GamificationProvider } from "@/components/gamification/GamificationProvider";
import { Fraunces, DM_Sans, JetBrains_Mono } from "next/font/google";
import type { Metadata } from "next";

const fraunces = Fraunces({ 
  subsets: ["latin"], 
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CoolCity-AI | Urban Heat Simulator",
  description: "Advanced urban heat island detection and intervention simulation",
  manifest: "/manifest.json",
  themeColor: "#a78bfa",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CoolCity",
  },
  icons: {
    apple: "/icon-192x192.png",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable} ${jetBrainsMono.variable}`}>
      <body className={`${fraunces.variable} ${dmSans.variable} font-body antialiased selection:bg-lavender-200 selection:text-lavender-900 bg-background text-foreground`}>
        <GamificationProvider>
          {children}
        </GamificationProvider>
      </body>
    </html>
  );
}
