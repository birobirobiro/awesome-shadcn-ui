import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sponsor } from "@/components/sponsors/sponsors";
import { motion } from "motion/react";
import React from "react";

const standardAnimations = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.2, ease: "easeOut" },
};

interface SponsorCardProps {
  sponsor: Sponsor;
}

const SponsorCard: React.FC<SponsorCardProps> = ({ sponsor }) => {
  const handleCardClick = () => {
    window.open(sponsor.url, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div layout {...standardAnimations} className="h-full">
      <Card
        className="h-full group hover:border-primary/40 hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer flex flex-col gap-0 py-0"
        onClick={handleCardClick}
      >
        <CardHeader className="p-4 pb-3 shrink-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/50 border border-border/40 bg-muted/20 px-2 py-0.5">
              [sponsored]
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </div>
          <CardTitle className="text-base font-bold group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-snug">
            {sponsor.name}
          </CardTitle>
        </CardHeader>

        <div className="h-px bg-border mx-4 shrink-0" />

        <CardContent className="px-4 py-3 flex-1 flex flex-col gap-3 min-h-0">
          <p className="text-sm text-muted-foreground line-clamp-3 flex-1 leading-relaxed overflow-hidden">
            {sponsor.description}
          </p>
        </CardContent>

        <div className="h-px bg-border mx-4 shrink-0" />

        <CardFooter className="flex gap-3 items-center p-4 pt-3 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
          >
            <a
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SponsorCard;
