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

    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
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
        duration: 700,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  }, [isDark, setTheme]);

  // Use CSS-based icon switching - no mounted state needed
  // Icons are always rendered, CSS shows/hides based on .dark class
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          ref={buttonRef}
          onClick={onToggle}
          variant="outline"
          size="icon"
          className="h-[34px] w-9"
          aria-label="Toggle theme"
        >
          {/* Sun icon - visible in dark mode */}
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:rotate-90 dark:scale-0 absolute" />
          {/* Moon icon - visible in light mode */}
          <Moon className="h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100 absolute" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        Switch to {isDark ? "light" : "dark"} mode
      </TooltipContent>
    </Tooltip>
  );
});
