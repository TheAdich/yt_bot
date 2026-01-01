import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Loading from "./components/loader/loading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "YouTube Shorts Manager",
  description: "Manage, create, and upload your YouTube Shorts with ease. Free TTS integration for dynamic videos.",

  // Basic SEO
  keywords: ["YouTube Shorts", "video manager", "TTS", "upload videos", "short videos", "video editor"],
  authors: [{ name: "Your Name or Company", url: "https://yt-bot-five.vercel.app" }],
  creator: "Aditya Dadhich",
  publisher: "Aditya Dadhich",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<Loading />}>
        {children}
        </Suspense>
      </body>
    </html>
  );
}
