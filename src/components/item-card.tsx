import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight, Bookmark, Calendar, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useMemo } from "react";

type LayoutType = "compact" | "grid" | "row";

interface ItemCardProps {
  id: number;
  title: string;
  description: string;
  url: string;
  category: string;
  date?: string;
  isBookmarked: boolean;
  onBookmark: (id: number) => void;
  layoutType: LayoutType;
  isBookmarkLoading?: boolean;
}

const standardAnimations = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { type: "spring", stiffness: 300, damping: 30 },
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
  layoutType = "grid",
  isBookmarkLoading = false,
}) => {
  const styles = useMemo(() => {
    switch (layoutType) {
      case "compact":
        return {
          card: "h-[240px] group border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300",
          container: "gap-1",
          title:
            "text-sm font-bold group-hover:text-primary transition-colors duration-300",
          badge: "text-xs px-2 py-0 h-5 mt-1",
          description:
            "text-xs opacity-80 group-hover:opacity-100 transition-opacity duration-300 min-h-[2.5rem] line-clamp-5",
          date: "text-xs opacity-60",
          button: "text-xs py-1 h-7",
          bookmarkBtn: "h-7 w-7",
          icon: "h-3.5 w-3.5",
          headerPadding: "p-3 pb-1",
          contentPadding: "px-3 py-1.5",
          footerPadding: "px-3 pb-3 pt-1.5",
          headerHeight: "h-[72px]",
          contentHeight: "h-[100px]",
          footerHeight: "h-[68px]",
        };
      case "row":
        return {
          card: "h-[240px] md:h-[140px] group border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300",
          container: "md:flex-row md:gap-4 gap-2",
          title:
            "text-base md:text-lg font-bold group-hover:text-primary transition-colors duration-300",
          badge: "text-xs md:text-sm",
          description:
            "text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2 md:line-clamp-2",
          date: "text-xs opacity-70",
          button: "text-sm",
          bookmarkBtn: "h-9 w-9",
          icon: "h-4 w-4",
          headerPadding: "p-4 md:pb-2",
          contentPadding: "px-4 py-2",
          footerPadding: "p-4 md:pt-2",
          headerHeight: "md:h-full",
          contentHeight: "md:h-full",
          footerHeight: "md:h-full",
        };
      case "grid":
      default:
        return {
          card: "h-[320px] group border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md dark:hover:shadow-2xl dark:hover:shadow-neutral-900/20 transition-all duration-300",
          container: "gap-3",
          title:
            "text-lg font-bold group-hover:text-primary transition-colors duration-300",
          badge: "text-xs",
          description:
            "text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300 min-h-[4.5rem] line-clamp-5",
          date: "text-xs opacity-70",
          button: "text-sm",
          bookmarkBtn: "h-10 w-10",
          icon: "h-4 w-4",
          headerPadding: "p-4 pb-2",
          contentPadding: "px-4 py-2",
          footerPadding: "px-4 pt-2 pb-4",
          headerHeight: "h-[100px]",
          contentHeight: "h-[140px]",
          footerHeight: "h-[80px]",
        };
    }
  }, [layoutType]);

  return (
    <motion.div layout {...standardAnimations} className={styles.container}>
      <Card className={cn(`overflow-hidden relative`, styles.card)}>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent dark:from-primary/10" />
        </div>

        <div
          className={cn(
            "flex flex-col h-full",
            layoutType === "row" ? "md:flex-row md:items-center" : "",
          )}
        >
          <CardHeader
            className={cn(
              styles.headerPadding,
              styles.headerHeight,
              layoutType === "row" ? "md:w-2/5 md:pr-0" : "",
              "transition-all duration-300",
            )}
          >
            {layoutType === "compact" ? (
              <div className="flex flex-col">
                <CardTitle className={styles.title}>{title}</CardTitle>
                <Badge
                  variant="secondary"
                  className={cn(
                    "shrink-0 transition-all duration-300 w-fit",
                    styles.badge,
                  )}
                >
                  {category}
                </Badge>
              </div>
            ) : (
              <div className="flex justify-between items-start gap-2">
                <CardTitle className={styles.title}>{title}</CardTitle>
                <Badge
                  variant="secondary"
                  className={cn(
                    "shrink-0 transition-all duration-300",
                    styles.badge,
                  )}
                >
                  {category}
                </Badge>
              </div>
            )}
            {layoutType === "row" && (
              <div className="flex items-center mt-1 text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1 opacity-70" />
                <span className={styles.date}>Added: {date}</span>
              </div>
            )}
          </CardHeader>

          <CardContent
            className={cn(
              "flex-grow",
              styles.contentPadding,
              styles.contentHeight,
              layoutType === "row" ? "md:w-2/5 md:px-0" : "",
              "transition-all duration-300",
            )}
          >
            <p className={cn("text-muted-foreground", styles.description)}>
              {description}
            </p>
            {layoutType !== "row" && (
              <motion.div
                className="flex items-center mt-2 text-muted-foreground"
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Calendar
                  className={cn(
                    "mr-1",
                    layoutType === "compact" ? "h-3 w-3" : "h-3.5 w-3.5",
                  )}
                />
                <span className={styles.date}>Added: {date}</span>
              </motion.div>
            )}
          </CardContent>

          <CardFooter
            className={cn(
              "flex gap-2 items-center",
              styles.footerPadding,
              styles.footerHeight,
              layoutType === "row" ? "md:w-1/5 md:justify-end" : "",
              "transition-all duration-300 mt-auto",
            )}
          >
            <motion.div
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button
                variant={isBookmarked ? "default" : "outline"}
                size={layoutType === "compact" ? "sm" : "icon"}
                onClick={() => !isBookmarkLoading && onBookmark(id)}
                disabled={isBookmarkLoading}
                className={cn(
                  "transition-all duration-300 flex-shrink-0",
                  styles.bookmarkBtn,
                  isBookmarked
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-600"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600",
                  isBookmarkLoading && "opacity-50 cursor-not-allowed",
                )}
              >
                <Bookmark
                  className={cn(
                    styles.icon,
                    "transition-all duration-300",
                    isBookmarked ? "scale-110 fill-current" : "scale-100",
                    isBookmarkLoading && "animate-pulse",
                  )}
                  fill={isBookmarked ? "currentColor" : "none"}
                />
              </Button>
            </motion.div>

            <Button
              asChild
              className={cn(
                "w-full group overflow-hidden relative",
                styles.button,
                "transition-all duration-300",
              )}
              variant="outline"
              size={layoutType === "compact" ? "sm" : "default"}
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <span className="relative z-10 flex items-center">
                  {layoutType === "compact" ? "View" : "View Resource"}
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    {layoutType === "compact" ? (
                      <ArrowUpRight className={cn("ml-1", styles.icon)} />
                    ) : (
                      <ExternalLink
                        className={cn(
                          "ml-1.5",
                          styles.icon === "h-5 w-5" ? "h-4 w-4" : styles.icon,
                        )}
                      />
                    )}
                  </span>
                </span>
                <span className="absolute inset-0 bg-primary/10 dark:bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              </a>
            </Button>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
};

export default ItemCard;
