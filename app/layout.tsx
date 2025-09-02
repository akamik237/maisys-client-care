import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import AppShell from "./AppShell";
import { UserProvider } from "../context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MaiSYS",
  keywords: ["MaiSYS", "Maisys", "Maisys Workflow", "Maisys Client-Care"],
  authors: [{ name: "La Régionale Banque" }],
  creator: "La Régionale Banque",
  openGraph: {
    title: "MaiSYS – Multi AI System",
    description: "Assistant IA pour la Régionale Banque : Workflow interne & Client Care",
    url: "https://maisys.laregionale.banque",
    siteName: "MaiSYS",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} light`} suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground min-h-screen m-0">
        <UserProvider>
          <AppShell>{children}</AppShell>
        </UserProvider>
      </body>
    </html>
  );
}
