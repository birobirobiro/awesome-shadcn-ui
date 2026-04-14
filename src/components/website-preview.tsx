"use client";

import { useWebsitePreview } from "@/hooks/use-website-preview";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe, Image } from "lucide-react";

interface WebsitePreviewProps {
  url: string;
  name: string;
}

export function WebsitePreview({ url, name }: WebsitePreviewProps) {
  const { previewState, screenshotUrl } = useWebsitePreview({ url });

  if (previewState === "loading") {
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

  if (previewState === "screenshot" && screenshotUrl) {
    return (
      <>
        <img
          src={screenshotUrl}
          alt={`${name} preview`}
          className="w-full h-full object-cover object-top"
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
  return (
    <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center text-center p-6">
      <Image className="h-12 w-12 text-muted-foreground mb-3" />
      <p className="text-sm text-muted-foreground mb-2">
        Preview not available
      </p>
      <p className="text-xs text-muted-foreground/70 mb-4 max-w-xs">
        This website blocks embedding. Click below to visit directly.
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
