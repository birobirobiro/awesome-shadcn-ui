"use client";

import { ArrowDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="shell hero__banner">
        <div className="hero__copy">
          <div className="hero__brand">
            <Logo className="h-7 w-auto shrink-0 sm:h-10" />
            <h1 id="hero-title" className="hero__title">
              awesome-shadcn/ui
            </h1>
          </div>
          <p className="hero__lead">
            Resources for your next{" "}
            <a
              href="https://ui.shadcn.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-rule-2 underline-offset-4 hover:text-foreground"
            >
              shadcn/ui
            </a>{" "}
            project.
          </p>
        </div>
        <div className="hero__actions">
          <Button asChild size="lg">
            <a href="#index">
              Browse resources
              <ArrowDown data-icon="inline-end" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
