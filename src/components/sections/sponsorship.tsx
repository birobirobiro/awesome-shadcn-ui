"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Plus } from "lucide-react";

export function Sponsorship() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono block text-center mb-2">
        Sponsored by
      </span>
      <div className="flex items-center justify-center gap-2">
        <a
          href="https://shadcnstudio.com/?utm_source=awesome-shadcn-ui&utm_medium=banner&utm_campaign=github"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex items-center justify-center gap-2 rounded-md bg-muted/30 px-3 py-1.5 transition-colors duration-200 hover:bg-muted/50 border border-border/50 max-sm:px-2 max-sm:py-2"
        >
          <svg
            viewBox="0 0 328 328"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 shrink-0"
          >
            <rect
              width="328"
              height="328"
              rx="164"
              fill="black"
              className="dark:fill-white"
            />
            <path
              d="M165.018 72.3008V132.771C165.018 152.653 148.9 168.771 129.018 168.771H70.2288"
              stroke="white"
              strokeWidth="20"
              className="dark:stroke-black"
            />
            <path
              d="M166.627 265.241L166.627 204.771C166.627 184.889 182.744 168.771 202.627 168.771L261.416 168.771"
              stroke="white"
              strokeWidth="20"
              className="dark:stroke-black"
            />
            <line
              x1="238.136"
              y1="98.8184"
              x2="196.76"
              y2="139.707"
              stroke="white"
              strokeWidth="20"
              className="dark:stroke-black"
            />
            <line
              x1="135.688"
              y1="200.957"
              x2="94.3128"
              y2="241.845"
              stroke="white"
              strokeWidth="20"
              className="dark:stroke-black"
            />
            <line
              x1="133.689"
              y1="137.524"
              x2="92.5566"
              y2="96.3914"
              stroke="white"
              strokeWidth="20"
              className="dark:stroke-black"
            />
            <line
              x1="237.679"
              y1="241.803"
              x2="196.547"
              y2="200.671"
              stroke="white"
              strokeWidth="20"
              className="dark:stroke-black"
            />
          </svg>

          <div className="flex flex-col max-sm:hidden">
            <span className="text-sm font-medium text-foreground">
              shadcnstudio.com
            </span>
            <span className="text-xs text-muted-foreground">
              shadcn blocks & templates
            </span>
          </div>
        </a>

        <Button variant="outline" size="sm" className="h-auto py-1.5" asChild>
          <a
            href="https://buy.stripe.com/28E28s6sUb3hbD4gPm0Jq03"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Plus className="w-5 h-5" />
          </a>
        </Button>
      </div>
    </motion.div>
  );
}
