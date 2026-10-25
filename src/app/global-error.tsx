"use client";

import { StateMessage } from "@/components/layout/state-message";
import { Button } from "@/components/ui/button";
import { AlertOctagon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <StateMessage
          icon={<AlertOctagon className="h-5 w-5" aria-hidden="true" />}
          title="Critical error"
          description="We've encountered a critical application error. Reload the application or return home."
        >
          <Button onClick={() => reset()} className="gap-2">
            Reload application
          </Button>
          <Button variant="outline" asChild>
            <Link prefetch={false} href="/">
              Return home
            </Link>
          </Button>
          {error.digest && (
            <p className="w-full text-center text-xs text-muted-foreground">
              Error ID: {error.digest}
            </p>
          )}
        </StateMessage>
      </body>
    </html>
  );
}
