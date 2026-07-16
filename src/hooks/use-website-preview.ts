"use client";

import { useEffect, useState } from "react";

/** Preview display modes */
type PreviewState = "loading" | "iframe" | "screenshot" | "fallback";

/**
 * Return type for the useWebsitePreview hook
 */
export interface UseWebsitePreviewReturn {
  /** Current preview display mode */
  previewState: PreviewState;
  /** Screenshot URL from Microlink API (when in screenshot mode) */
  screenshotUrl: string | null;
  /** Favicon URL from DuckDuckGo icons service */
  faviconUrl: string | null;
}

/**
 * Manages website preview state with progressive fallback strategy.
 *
 * Attempts to display website in this order:
 * 1. **iframe** - Direct embedding, but only after /api/preview-check confirms
 *    the site's headers allow framing (blocked frames still fire onload, so
 *    this can't be detected client-side)
 * 2. **screenshot** - Microlink API screenshot if the site blocks embedding
 * 3. **fallback** - Generic placeholder if all else fails
 *
 * @param url - The website URL to preview
 * @returns Preview state and related URLs
 *
 * @example
 * ```tsx
 * const { previewState, screenshotUrl, faviconUrl } = useWebsitePreview({
 *   url: "https://example.com"
 * })
 *
 * if (previewState === "iframe") {
 *   return <iframe src={url} />
 * } else if (previewState === "screenshot" && screenshotUrl) {
 *   return <img src={screenshotUrl} />
 * }
 * ```
 */
export function useWebsitePreview({
  url,
}: {
  url: string;
}): UseWebsitePreviewReturn {
  const [previewState, setPreviewState] = useState<PreviewState>("loading");
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Extract domain for favicon
    try {
      const domain = new URL(url).hostname;
      setFaviconUrl(`https://icons.duckduckgo.com/ip3/${domain}.ico`);
    } catch {
      setFaviconUrl(null);
    }

    const loadScreenshot = async () => {
      try {
        const microlinkUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=false`;
        const response = await fetch(microlinkUrl);
        const data = await response.json();

        if (!isMounted) return;

        if (data.status === "success" && data.data?.screenshot?.url) {
          setScreenshotUrl(data.data.screenshot.url);
          setPreviewState("screenshot");
        } else {
          setPreviewState("fallback");
        }
      } catch {
        if (isMounted) {
          setPreviewState("fallback");
        }
      }
    };

    const checkEmbeddable = async () => {
      try {
        const response = await fetch(
          `/api/preview-check?url=${encodeURIComponent(url)}`,
        );
        const data = await response.json();

        if (!isMounted) return;

        if (data.embeddable) {
          setPreviewState("iframe");
        } else {
          setPreviewState("screenshot");
          loadScreenshot();
        }
      } catch {
        if (!isMounted) return;
        setPreviewState("screenshot");
        loadScreenshot();
      }
    };

    checkEmbeddable();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return {
    previewState,
    screenshotUrl,
    faviconUrl,
  };
}
