"use client";

import { StateMessage } from "@/components/layout/state-message";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function ItemError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Item error:", error);
  }, [error]);

  return (
    <StateMessage
      icon={<AlertTriangle className="h-5 w-5" aria-hidden="true" />}
      title="Failed to load item"
      description="We couldn't load this item page. The item might not exist or there's a temporary issue."
    >
      <Button onClick={reset} className="gap-2">
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Try again
      </Button>
      <Button variant="outline" asChild>
        <Link prefetch={false} href="/categories" className="gap-2">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to categories
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link prefetch={false} href="/" className="gap-2">
          <Home className="h-4 w-4" aria-hidden="true" />
          Homepage
        </Link>
      </Button>
      {process.env.NODE_ENV === "development" && (
        <details className="state-message__details">
          <summary>Error details (development)</summary>
          <pre>
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}
    </StateMessage>
  );
}
