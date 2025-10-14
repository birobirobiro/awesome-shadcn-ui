import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Bookmark, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
  transition: { type: "spring" as const, stiffness: 300, damping: 30 },
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
    <motion.div layout {...standardAnimations} className="gap-3">
      <Card
        className="h-[320px] group hover:border-primary/20 hover:shadow-md dark:hover:shadow-2xl dark:hover:shadow-neutral-900/20 transition-all duration-300 overflow-hidden relative cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent dark:from-primary/10" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <CardHeader className="p-4 pb-2 h-auto">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2">
                  {title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>
          </CardHeader>

          <CardContent className="px-4 py-2 flex-1 flex flex-col">
            <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300 min-h-[4.5rem] line-clamp-5 flex-1">
              {description}
            </p>

            {date && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700"
              >
                <span className="text-xs opacity-70">Added: {date}</span>
              </motion.div>
            )}
          </CardContent>

          <CardFooter className="flex gap-2 items-center justify-between p-4 pt-2 h-auto transition-all duration-300 mt-auto">
            {/* Bookmark Button */}
            <motion.div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isBookmarkLoading) onBookmark(id);
              }}
            >
              <Button
                variant={isBookmarked ? "default" : "outline"}
                size="icon"
                disabled={isBookmarkLoading}
                className={cn(
                  "transition-all duration-300 flex-shrink-0 h-10 w-10",
                  isBookmarked
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-600"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600",
                  isBookmarkLoading && "opacity-50 cursor-not-allowed",
                )}
              >
                <Bookmark
                  className={cn(
                    "h-4 w-4 transition-all duration-300",
                    isBookmarked ? "fill-current" : "",
                    isBookmarkLoading && "animate-pulse",
                  )}
                  fill={isBookmarked ? "currentColor" : "none"}
                />
              </Button>
            </motion.div>

            {/* External Link Button */}
            <motion.div>
              <Button
                variant="outline"
                size="icon"
                asChild
                className="transition-all duration-300 flex-shrink-0 h-10 w-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600"
              >
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </motion.div>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
};

export default ItemCard;
