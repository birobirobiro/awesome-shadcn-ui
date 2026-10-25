"use client";

import { memo, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const REPO_OWNER = "birobirobiro";
const REPO_NAME = "awesome-shadcn-ui";

let cachedStars: number | null = null;
let starsRequest: Promise<number | null> | null = null;

function getStars(): Promise<number | null> {
  // Header, footer and Strict Mode share the same request, including failures.
  starsRequest ??= fetch("/api/github-stars")
    .then(async (response) => {
      if (!response.ok) return null;
      const data = await response.json();
      if (!Number.isSafeInteger(data.stars) || data.stars < 0) return null;
      cachedStars = data.stars;
      return cachedStars;
    })
    .catch(() => null);
  return starsRequest;
}

export const GitHubStars = memo(function GitHubStars() {
  const [stars, setStars] = useState<number | null>(cachedStars);

  useEffect(() => {
    let active = true;
    void getStars().then((value) => {
      if (active) setStars(value);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-11! w-11! gap-1.5 px-0 sm:h-10! sm:w-auto! sm:px-2"
          asChild
        >
          <a
            href={`https://github.com/${REPO_OWNER}/${REPO_NAME}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={
              stars !== null
                ? `View the GitHub repository, ${stars} stars`
                : "View the GitHub repository"
            }
          >
            <svg
              className="h-4 w-4 -translate-y-px"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            {stars !== null ? (
              <span className="hidden font-mono text-xs tabular-nums text-muted-foreground sm:inline">
                {new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                })
                  .format(stars)
                  .toLowerCase()}
              </span>
            ) : (
              <span className="hidden text-xs text-muted-foreground sm:inline">
                GitHub
              </span>
            )}
          </a>
        </Button>
      </TooltipTrigger>

      <TooltipContent>
        {stars !== null
          ? `${new Intl.NumberFormat("en-US").format(stars)} stars`
          : "View on GitHub"}
      </TooltipContent>
    </Tooltip>
  );
});
