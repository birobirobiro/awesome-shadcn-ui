"use client";

import { useEffect, useState } from "react";

type PreviewState = "loading" | "screenshot" | "fallback";

export function useWebsitePreview({ url }: { url: string }) {
  const [preview, setPreview] = useState<{
    url: string;
    state: PreviewState;
    screenshotUrl: string | null;
  }>({ url, state: "loading", screenshotUrl: null });

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    let active = true;

    async function loadScreenshot() {
      try {
        const endpoint = `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=false`;
        const response = await fetch(endpoint, { signal: controller.signal });
        if (!response.ok) throw new Error("Preview request failed");
        const data = await response.json();
        if (!active) return;
        const screenshotUrl =
          data.status === "success" &&
          typeof data.data?.screenshot?.url === "string"
            ? data.data.screenshot.url
            : null;
        setPreview({
          url,
          state: screenshotUrl ? "screenshot" : "fallback",
          screenshotUrl,
        });
      } catch {
        if (active) setPreview({ url, state: "fallback", screenshotUrl: null });
      } finally {
        clearTimeout(timeout);
      }
    }

    void loadScreenshot();
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [url]);

  return preview.url === url
    ? { previewState: preview.state, screenshotUrl: preview.screenshotUrl }
    : { previewState: "loading" as const, screenshotUrl: null };
}
