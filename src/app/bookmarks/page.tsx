"use client";

import { ItemGrid } from "@/components/item-grid";
import { PageHeader } from "@/components/layout/page-header";
import { PaginationControls } from "@/components/pagination-controls";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookmarks } from "@/hooks/use-bookmark";
import { useDebounce } from "@/hooks/use-debounce";
import { fetchAndParseReadme, Resource } from "@/hooks/use-readme";
import { Bookmark, Search } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const ITEMS_PER_PAGE_OPTIONS = [20, 40, 60, 80];

export default function BookmarksPage() {
  const [items, setItems] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<Resource[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const {
    bookmarkedItems,
    toggleBookmark,
    clearBookmarks,
    isLoading: isBookmarkLoading,
  } = useBookmarks();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const fetchedResources = await fetchAndParseReadme();

        const bookmarkedResources = fetchedResources.filter((item) =>
          bookmarkedItems.includes(item.id),
        );

        setItems(bookmarkedResources);
        setFilteredItems(bookmarkedResources);
      } catch (error) {
        console.error("Error fetching bookmarked items:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (!isBookmarkLoading) {
      fetchData();
    }
  }, [bookmarkedItems, isBookmarkLoading]);

  useEffect(() => {
    if (debouncedSearchQuery) {
      const filtered = items.filter(
        (item) =>
          item.name
            ?.toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          item.description
            ?.toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()),
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
    setCurrentPage(1);
  }, [debouncedSearchQuery, items]);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleItemsPerPageChange = useCallback((value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  }, []);

  const handleClearBookmarks = useCallback(() => {
    clearBookmarks();
    setShowClearDialog(false);
    setSearchQuery("");
  }, [clearBookmarks]);

  if (isLoading || isBookmarkLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <Skeleton className="h-8 sm:h-12 w-full max-w-96" />
            <Skeleton className="h-4 sm:h-6 w-full max-w-64" />
            <div className="flex items-center gap-2 sm:gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-2" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-8 sm:h-10 w-full max-w-md" />
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 sm:h-6 w-3/4" />
                  <Skeleton className="h-4 sm:h-5 w-20" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 sm:h-4 w-full" />
                  <Skeleton className="h-3 sm:h-4 w-5/6" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-8 sm:h-9 sm:w-9" />
                  <Skeleton className="h-8 w-8 sm:h-9 sm:w-9" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 gap-3 sm:gap-0">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-20 sm:w-24" />
              <Skeleton className="h-8 sm:h-10 w-[60px] sm:w-[70px]" />
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Skeleton className="h-8 w-8 sm:h-10 sm:w-10" />
              <Skeleton className="h-8 w-8 sm:h-10 sm:w-10" />
              <Skeleton className="h-4 w-12 sm:w-16" />
              <Skeleton className="h-8 w-8 sm:h-10 sm:w-10" />
              <Skeleton className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader
        title="Bookmarks"
        description="Your saved shadcn/ui resources"
        breadcrumbs={[{ label: "Bookmarks", href: "/bookmarks" }]}
        actions={
          <div className="space-y-3 sm:space-y-4 w-full">
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <span>
                {items.length} {items.length === 1 ? "bookmark" : "bookmarks"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
              <div className="w-full sm:flex-1 max-w-md">
                <Input
                  type="text"
                  placeholder="Search your bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10"
                />
              </div>
              {items.length > 0 && (
                <div className="p-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowClearDialog(true)}
                    className="w-full sm:w-auto text-sm sm:text-base"
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </div>
          </div>
        }
      />

      <div className="min-h-[400px] mb-6 sm:mb-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-center px-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bookmark className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              Start saving your favorite shadcn/ui resources by clicking the
              bookmark icon on any item.
            </p>
            <Button asChild>
              <Link href="/">Browse resources</Link>
            </Button>
          </div>
        ) : filteredItems.length === 0 && debouncedSearchQuery ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-center px-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-sm text-muted-foreground mb-6">
              No bookmarks match your search for "{debouncedSearchQuery}"
            </p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear search
            </Button>
          </div>
        ) : (
          <ItemGrid
            items={currentItems}
            bookmarkedItems={bookmarkedItems}
            onBookmark={toggleBookmark}
            isBookmarkLoading={isBookmarkLoading}
          />
        )}
      </div>

      {filteredItems.length > 0 && items.length > 0 && (
        <div>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            handlePageChange={handlePageChange}
            handleItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
          />
        </div>
      )}

      {items.length > 0 && (
        <div className="text-xs sm:text-sm text-muted-foreground text-center mt-4 sm:mt-6">
          Showing {indexOfFirstItem + 1} -{" "}
          {Math.min(indexOfLastItem, filteredItems.length)} of{" "}
          {filteredItems.length}{" "}
          {filteredItems.length === 1 ? "bookmark" : "bookmarks"}
        </div>
      )}

      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear All Bookmarks?</DialogTitle>
            <DialogDescription>
              This will remove all your bookmarked items. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearBookmarks}>
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
