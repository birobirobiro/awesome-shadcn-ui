"use client";

import { useWebsitePreview } from "@/hooks/use-website-preview";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe } from "lucide-react";
import { useEffect, useState } from "react";

interface WebsitePreviewProps {
  url: string;
  name: string;
}

export function WebsitePreview({ url, name }: WebsitePreviewProps) {
  const { previewState, screenshotUrl } = useWebsitePreview({ url });
  const [screenshotFailed, setScreenshotFailed] = useState(false);

  useEffect(() => {
    setScreenshotFailed(false);
  }, [url]);

  if (
    previewState === "loading" ||
    (previewState === "screenshot" && !screenshotUrl && !screenshotFailed)
  ) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (previewState === "iframe") {
    return (
      <>
        <iframe
          src={url}
          className="w-full h-full border-0"
          title={`Preview of ${name}`}
          sandbox="allow-scripts allow-same-origin"
        />
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 bg-transparent cursor-pointer z-10"
          title={`Visit ${name} - Opens in new tab`}
          aria-label={`Visit ${name} website`}
        >
          <span className="sr-only">Visit {name} website</span>
        </a>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
          <ExternalLink className="h-8 w-8 text-white mb-2" />
          <p className="text-lg font-medium text-white">Visit website</p>
          <p className="text-sm text-white/80 mt-1">Click to open</p>
        </div>
      </>
    );
  }

  if (previewState === "screenshot" && screenshotUrl && !screenshotFailed) {
    return (
      <>
        <img
          src={screenshotUrl}
          alt={`${name} preview`}
          className="w-full h-full object-cover object-top"
          onError={() => setScreenshotFailed(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
          <ExternalLink className="h-8 w-8 text-white mb-2" />
          <p className="text-lg font-medium text-white">Visit website</p>
          <p className="text-sm text-white/80 mt-1">Screenshot preview</p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 bg-transparent cursor-pointer z-10"
          title={`Visit ${name} - Opens in new tab`}
          aria-label={`Visit ${name} website`}
        >
          <span className="sr-only">Visit {name} website</span>
        </a>
      </>
    );
  }

  // Fallback state
  let hostname = url;
  try {
    hostname = new URL(url).hostname;
  } catch {
    // keep the raw URL if it can't be parsed
  }

  return (
    <div className="absolute inset-0 bg-muted/50 flex flex-col items-center justify-center text-center p-6">
      <div className="flex h-16 w-16 items-center justify-center border bg-background mb-4">
        <Globe className="h-7 w-7 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground mb-1">
        Preview not available
      </p>
      <p className="text-xs text-muted-foreground mb-4 max-w-xs break-words">
        We couldn't load a preview for {hostname}. Visit the website to see it
        live.
      </p>
      <Button asChild size="sm">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Visit Website
        </a>
      </Button>
    </div>
  );
}
