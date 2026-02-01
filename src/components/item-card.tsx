import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Bookmark, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { categoryNameToSlug } from "@/lib/slugs";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React from "react";

interface ItemCardProps {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  date?: string;
  isBookmarked: boolean;
  onBookmark: (id: string) => void;
  isBookmarkLoading?: boolean;
}

const standardAnimations = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.2, ease: "easeOut" },
};

const ItemCard: React.FC<ItemCardProps> = ({
  id,
  title,
  description,
  url,
  category,
  date,
  isBookmarked,
  onBookmark,
  isBookmarkLoading = false,
}) => {
  const handleCardClick = () => {
    window.location.href = `/categories/${categoryNameToSlug(category)}/${id}`;
  };

  return (
    <motion.div layout {...standardAnimations}>
      <Card
        className="min-h-[240px] group hover:border-primary/40 hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer flex flex-col"
        onClick={handleCardClick}
      >
        <CardHeader className="p-3 pb-2">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-primary border border-primary/30 bg-primary/5 px-1.5 py-0.5 rounded">
              [{category}]
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </div>
          <CardTitle className="text-base font-bold group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-tight">
            {title}
          </CardTitle>
        </CardHeader>

        <div className="h-px bg-border mx-3" />

        <CardContent className="px-3 py-2 flex-1 flex flex-col gap-2">
          <p className="text-sm text-muted-foreground line-clamp-3 flex-1 leading-relaxed">
            {description}
          </p>

          {date && (
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span>Added: {date}</span>
            </div>
          )}
        </CardContent>

        <div className="h-px bg-border mx-3" />

        <CardFooter className="flex gap-2 items-center p-3 pt-2">
          {/* Bookmark Button */}
          <Button
            variant={isBookmarked ? "default" : "ghost"}
            size="icon"
            disabled={isBookmarkLoading}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isBookmarkLoading) onBookmark(id);
            }}
            className={cn(
              "h-8 w-8 transition-all duration-200",
              isBookmarked
                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
              isBookmarkLoading && "opacity-50 cursor-not-allowed",
            )}
          >
            <Bookmark
              className={cn(
                "h-3.5 w-3.5",
                isBookmarked && "fill-current",
                isBookmarkLoading && "animate-pulse",
              )}
            />
          </Button>

          {/* External Link Button */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
          >
            <a
              href={url}
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

export default ItemCard;
