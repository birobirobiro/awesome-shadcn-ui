"use client";

import { Button } from "@/components/ui/button";
import { AlertOctagon } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-20 text-center">
          <div className="relative z-10 mx-auto max-w-xl">
            <div className="mb-6 flex justify-center">
              <AlertOctagon className="size-20 text-destructive" />
            </div>
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl">
              Critical Error
            </h1>
            <p className="mb-8 text-base text-muted-foreground sm:text-lg">
              We've encountered a critical application error.
              <br className="hidden sm:block" />
              Our team has been automatically notified and is working to resolve
              the issue.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={() => reset()} size="lg" variant="default">
                Reload Application
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="/">Return Home</a>
              </Button>
            </div>
            {error.digest && (
              <p className="mt-6 text-xs text-muted-foreground">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
