import { StateMessage } from "@/components/layout/state-message";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <StateMessage
      icon={
        <span className="font-mono text-lg font-medium tracking-[-0.04em]">
          404
        </span>
      }
      title="Page not found"
      description="Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or the URL might be incorrect."
    >
      <Button asChild size="lg">
        <Link prefetch={false} href="/">
          Return home
        </Link>
      </Button>
      <Button asChild size="lg" variant="outline">
        <Link prefetch={false} href="/categories">
          Browse categories
        </Link>
      </Button>
    </StateMessage>
  );
}
