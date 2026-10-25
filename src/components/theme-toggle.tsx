"use client";

import { useRef, useCallback, memo } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ModeToggle = memo(function ModeToggle() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { setTheme, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const onToggle = useCallback(async () => {
    if (!buttonRef.current) return;

    const newTheme = isDark ? "light" : "dark";
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!document.startViewTransition || reduceMotion) {
      setTheme(newTheme);
      return;
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
    }).ready;

    const { left, top, width, height } =
      buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const maxDistance = Math.hypot(
      Math.max(centerX, window.innerWidth - centerX),
      Math.max(centerY, window.innerHeight - centerY),
    );

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${centerX}px ${centerY}px)`,
          `circle(${maxDistance}px at ${centerX}px ${centerY}px)`,
        ],
      },
      {
        duration: 500,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  }, [isDark, setTheme]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          ref={buttonRef}
          onClick={onToggle}
          variant="ghost"
          size="icon"
          className="h-11! w-11! sm:h-10! sm:w-10!"
          aria-label="Toggle theme"
        >
          <Sun
            className="absolute h-4 w-4 rotate-0 scale-100 transition-transform duration-[var(--dur-micro)] dark:rotate-90 dark:scale-0"
            aria-hidden="true"
          />
          <Moon
            className="absolute h-4 w-4 rotate-90 scale-0 transition-transform duration-[var(--dur-micro)] dark:rotate-0 dark:scale-100"
            aria-hidden="true"
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        Switch to {isDark ? "light" : "dark"} mode
      </TooltipContent>
    </Tooltip>
  );
});
