import { Resource } from "@/hooks/use-readme";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import ItemCard from "./item-card";

interface ItemGridProps {
  items: Resource[];
  bookmarkedItems: string[];
  onBookmark: (id: string) => void;
  isBookmarkLoading?: boolean;
}

export function ItemGrid({
  items,
  bookmarkedItems,
  onBookmark,
  isBookmarkLoading = false,
}: ItemGridProps) {
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="text-center py-12 rounded-md border border-dashed border-border bg-muted/30"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="inline-flex justify-center items-center w-16 h-16 rounded-md bg-muted mb-4"
        >
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </motion.div>
        <p className="text-foreground text-lg font-medium">
          No items found matching your criteria.
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          Try adjusting your search or filter settings.
        </p>
      </motion.div>
    );
  }

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait">
        <motion.div
          key={`grid`}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          layout
        >
          {items.map((item) => (
            <ItemCard
              key={`${item.id}`}
              id={item.id}
              title={item.name}
              description={item.description}
              url={item.url}
              category={item.category}
              date={item.date}
              isBookmarked={bookmarkedItems.includes(item.id)}
              onBookmark={onBookmark}
              isBookmarkLoading={isBookmarkLoading}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </LayoutGroup>
  );
}
