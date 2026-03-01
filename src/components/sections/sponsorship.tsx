"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { sponsors } from "@/components/sponsors/sponsors";

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
        {sponsors.map((sponsor) => (
          <a
            key={sponsor.name}
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center justify-center gap-2 bg-muted/30 px-3 py-1.5 transition-colors duration-200 hover:bg-muted/50 border border-border/50 max-sm:px-2 max-sm:py-2"
          >
            {sponsor.LogoComponent}

            <div className="flex flex-col max-sm:hidden">
              <span className="text-sm font-medium text-foreground">
                {sponsor.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {sponsor.description}
              </span>
            </div>
          </a>
        ))}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="h-8" asChild>
              <a
                href="https://buy.stripe.com/28E28s6sUb3hbD4gPm0Jq03"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Plus className="w-5 h-5" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Become a sponsor</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </motion.div>
  );
}
