import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const siteUrl = "https://akirasane.github.io";
const title = "Chatkawin Taola — Full Stack Developer & System Analyst";
const description =
  "Passionate developer with experience building scalable web applications and analyzing complex business requirements.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "Chatkawin Taola",
    type: "website",
    images: [
      {
        url: "/img/avatar.jpg",
        width: 800,
        height: 800,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/img/avatar.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={cn("h-full", "antialiased", geistSans.variable, jetbrainsMono.variable, "font-sans")}
    >
      <body className="h-full flex flex-col overflow-hidden">
        {children}
      </body>
    </html>
  );
}
