import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Loading from "./components/loader/loading";
import Footer from "./components/Footer/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  verification:{
    google:"bJYHDIvN5ZC3PONTgmKnhAGYIHrXrQ_f7uqzftqY_jM"
  },
   title: "YTShorts Automator by AD",
  description: "Manage, create, and upload your YouTube Shorts with ease from YTShorts Automator by AD. Free TTS integration for dynamic videos.",

  // Basic SEO
  keywords: ["YTShorts", "YouTube Shorts", "video manager", "TTS", "upload videos", "short videos", "video editor"],
  authors: [{ name: "Aditya Dadhich", url: "https://yt-bot-five.vercel.app" }],
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
        <Footer />  
        </Suspense>
      </body>
    </html>
  );
}
