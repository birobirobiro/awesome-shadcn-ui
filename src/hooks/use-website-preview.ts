"use client";

import { useEffect, useState } from "react";

interface WebsitePreviewProps {
  url: string;
  name: string;
}

export function useWebsitePreview({ url, name }: WebsitePreviewProps) {
  const [previewState, setPreviewState] = useState<
    "loading" | "iframe" | "screenshot" | "fallback"
  >("loading");
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);

  useEffect(() => {
    const domain = new URL(url).hostname;
    setFaviconUrl(`https://icons.duckduckgo.com/ip3/${domain}.ico`);

    // Try iframe first
    const checkIframe = () => {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;

      const timeout = setTimeout(() => {
        // If iframe takes too long, try screenshot
        setPreviewState("screenshot");
        loadScreenshot();
        document.body.removeChild(iframe);
      }, 3000);

      iframe.onload = () => {
        clearTimeout(timeout);
        setPreviewState("iframe");
        document.body.removeChild(iframe);
      };

      iframe.onerror = () => {
        clearTimeout(timeout);
        setPreviewState("screenshot");
        loadScreenshot();
        document.body.removeChild(iframe);
      };

      document.body.appendChild(iframe);
    };

    const loadScreenshot = async () => {
      try {
        const microlinkUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=false`;
        const response = await fetch(microlinkUrl);
        const data = await response.json();

        if (data.status === "success" && data.data?.screenshot?.url) {
          setScreenshotUrl(data.data.screenshot.url);
          setPreviewState("screenshot");
        } else {
          setPreviewState("fallback");
        }
      } catch (error) {
        console.error("Error loading screenshot:", error);
        setPreviewState("fallback");
      }
    };

    checkIframe();

    return () => {
      // Cleanup
    };
  }, [url]);

  return {
    previewState,
    screenshotUrl,
    faviconUrl,
  };
}
