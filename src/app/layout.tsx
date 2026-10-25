import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Providers } from "@/providers/providers";
import { type Metadata, type Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";

import type React from "react";

import { cn } from "@/lib/utils";

import "@/app/globals.css";
import { Atkinson_Hyperlegible_Mono, Host_Grotesk } from "next/font/google";

export const metadata: Metadata = {
  metadataBase: new URL("https://awesomeshadcn.dev"),
  title: {
    default: "awesome-shadcn/ui",
    template: `%s | awesome-shadcn/ui`,
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
    canonical: "https://awesomeshadcn.dev/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://awesomeshadcn.dev/",
    siteName: "awesome-shadcn/ui",
    title: "awesome-shadcn/ui",
    description: "A curated list of awesome things related to shadcn/ui",
    images: [
      {
        url: "/seo.png",
        width: 1200,
        height: 630,
        alt: "awesome-shadcn/ui",
      },
    ],
  },
  twitter: {
    creator: "@birobirobiro",
    site: "@birobirobiro",
    card: "summary_large_image",
    title: "awesome-shadcn/ui",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#121016" },
  ],
};

const hostGrotesk = Host_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const atkinsonMono = Atkinson_Hyperlegible_Mono({
  variable: "--font-atkinson-mono",
  adjustFontFallback: false,
  subsets: ["latin"],
  weight: ["400", "500"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          hostGrotesk.variable,
          atkinsonMono.variable,
        )}
      >
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
        <Providers>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
