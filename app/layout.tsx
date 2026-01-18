import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import { Navbar } from "@/components/layout/Navbar";
import { JsonLd } from "@/components/seo/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PageSpeed Export - Free PDF, Markdown & TOON Reports",
    template: "%s | PageSpeed Export",
  },
  description:
    "Analyze your website performance with Google PageSpeed Insights and export detailed reports in PDF, Markdown, and TOON formats. Free, fast, and no login required.",
  keywords: [
    "pagespeed insights",
    "google lighthouse",
    "web perfomance",
    "export lighthouse report",
    "pdf report",
    "markdown export",
    "toon format",
    "seo audit",
    "core web vitals",
  ],
  authors: [{ name: "PageSpeed Export" }],
  creator: "PageSpeed Export",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pagespeed.export",
    title: "PageSpeed Export - Free PDF, Markdown & TOON Reports",
    description:
      "Analyze your website performance with Google PageSpeed Insights and export detailed reports in PDF, Markdown, and TOON formats.",
    siteName: "PageSpeed Export",
  },
  twitter: {
    card: "summary_large_image",
    title: "PageSpeed Export - Free PDF, Markdown & TOON Reports",
    description:
      "Analyze your website performance with Google PageSpeed Insights and export detailed reports in PDF, Markdown, and TOON formats.",
    creator: "@pagespeedexport",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground selection:bg-primary/20`}
      >
        <QueryProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
          </div>
          <JsonLd />
        </QueryProvider>
      </body>
    </html>
  );
}
