"use client";

import { useEffect, useRef, useState } from "react";

/** Preview display modes */
type PreviewState = "loading" | "iframe" | "screenshot" | "fallback";

/** Timeout for iframe loading check (ms) */
const IFRAME_TIMEOUT = 3000;

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
 * 1. **iframe** - Direct embedding if the site allows it
 * 2. **screenshot** - Microlink API screenshot if iframe fails/times out
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
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    const cleanupIframe = () => {
      if (iframeRef.current && document.body.contains(iframeRef.current)) {
        document.body.removeChild(iframeRef.current);
        iframeRef.current = null;
      }
    };

    const checkIframe = () => {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      iframeRef.current = iframe;

      timeoutRef.current = setTimeout(() => {
        if (!isMounted) return;
        setPreviewState("screenshot");
        loadScreenshot();
        cleanupIframe();
      }, IFRAME_TIMEOUT);

      iframe.onload = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (!isMounted) return;
        setPreviewState("iframe");
        cleanupIframe();
      };

      iframe.onerror = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (!isMounted) return;
        setPreviewState("screenshot");
        loadScreenshot();
        cleanupIframe();
      };

      document.body.appendChild(iframe);
    };

    checkIframe();

    return () => {
      isMounted = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      cleanupIframe();
    };
  }, [url]);

  return {
    previewState,
    screenshotUrl,
    faviconUrl,
  };
}
