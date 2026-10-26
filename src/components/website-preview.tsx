"use client";

import { Skeleton } from "@/components/ui/skeleton";

import { useWebsitePreview } from "@/hooks/use-website-preview";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe } from "lucide-react";
import { useState } from "react";

interface WebsitePreviewProps {
  url: string;
  name: string;
}

function PreviewFallback({
  url,
  name,
  hostname,
}: {
  url: string;
  name: string;
  hostname: string;
}) {
  return (
    <Empty className="h-full min-h-[20rem]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Globe aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>Preview not available</EmptyTitle>
        <EmptyDescription>
          We couldn&apos;t load a preview for {hostname}. Visit the website to
          see it live.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild size="sm">
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink data-icon="inline-start" aria-hidden="true" />
            Visit website
          </a>
        </Button>
      </EmptyContent>
      <span className="sr-only">{name}</span>
    </Empty>
  );
}

function Screenshot({
  screenshotUrl,
  url,
  name,
  hostname,
}: {
  screenshotUrl: string;
  url: string;
  name: string;
  hostname: string;
}) {
  const [screenshotFailed, setScreenshotFailed] = useState(false);

  if (screenshotFailed) {
    return <PreviewFallback url={url} name={name} hostname={hostname} />;
  }

  return (
    <img
      src={screenshotUrl}
      alt={`${name} preview`}
      className="h-full min-h-[20rem] w-full object-cover object-top"
      onError={() => setScreenshotFailed(true)}
    />
  );
}

export function WebsitePreview({ url, name }: WebsitePreviewProps) {
  const { previewState, screenshotUrl } = useWebsitePreview({ url });

  let hostname = url;
  try {
    hostname = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    // keep the raw URL if it can't be parsed
  }

  if (
    previewState === "loading" ||
    (previewState === "screenshot" && !screenshotUrl)
  ) {
    return (
      <div
        className="flex h-full min-h-[20rem] flex-col justify-center gap-3 p-6"
        aria-live="polite"
        aria-busy="true"
      >
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="mt-3 h-32 w-full" />
        <span className="text-xs text-muted-foreground">Loading preview…</span>
      </div>
    );
  }

  if (previewState === "screenshot" && screenshotUrl) {
    return (
      <Screenshot
        key={url}
        screenshotUrl={screenshotUrl}
        url={url}
        name={name}
        hostname={hostname}
      />
    );
  }

  return <PreviewFallback url={url} name={name} hostname={hostname} />;
}
