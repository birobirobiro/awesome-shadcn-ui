import Donation from "@/components/donation";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Providers } from "@/providers/providers";
import { type Metadata, type Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";

import type React from "react";
import { Suspense } from "react";

import { cn } from "@/lib/utils";

import "@/app/globals.css";
import { Geist, Geist_Mono } from "next/font/google";

export const metadata: Metadata = {
  metadataBase: new URL("https://awesome-shadcn-ui.vercel.app"),
  title: {
    default: "awesome-shadcn-ui",
    template: `%s | awesome-shadcn-ui`,
  },
  description: "A curated list of awesome things related to shadcn/ui",
  keywords: [
    "shadcn",
    "ui library",
    "awesome",
    "github",
    "readme",
    "shad",
    "awesome list",
    "awesome shad",
    "shadcn ui",
  ],
  alternates: {
    canonical: "https://awesome-shadcn-ui.vercel.app/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://awesome-shadcn-ui.vercel.app/",
    siteName: "awesome-shadcn-ui",
    title: "awesome-shadcn-ui",
    description: "A curated list of awesome things related to shadcn/ui",
    images: [
      {
        url: "/seo.png",
        width: 1200,
        height: 630,
        alt: "awesome-shadcn-ui",
      },
    ],
  },
  twitter: {
    creator: "@birobirobiro",
    site: "@birobirobiro",
    card: "summary_large_image",
    title: "awesome-shadcn-ui",
    description: "A curated list of awesome things related to shadcn/ui",
    images: ["/seo.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
        <Providers>
          <Suspense>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Donation />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
