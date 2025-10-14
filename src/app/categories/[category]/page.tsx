"use client";

import { ItemGrid } from "@/components/item-grid";
import { PageHeader } from "@/components/layout/page-header";
import { PaginationControls } from "@/components/pagination-controls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookmarks } from "@/hooks/use-bookmark";
import { useDebounce } from "@/hooks/use-debounce";
import { fetchAndParseReadme, Resource } from "@/hooks/use-readme";
import { slugToCategoryName } from "@/lib/slugs";
import { motion } from "motion/react";
import { use, useCallback, useEffect, useState } from "react";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Libs and Components":
    "Essential libraries and reusable components built with shadcn/ui",
  Registries: "Component registries and collections for shadcn/ui",
  "Plugins and Extensions":
    "Tools and extensions that enhance your shadcn/ui workflow",
  "Colors and Customizations":
    "Themes, color palettes, and customization utilities",
  Animations: "Animation libraries and motion components for shadcn/ui",
  Tools: "Development tools, generators, and utilities for shadcn/ui projects",
  "Websites and Portfolios Inspirations":
    "Real-world examples and inspiration for your projects",
  Platforms: "Platforms and services that integrate with shadcn/ui",
  Ports: "Ports of shadcn/ui to other frameworks and technologies",
  "Design System": "Complete design systems and component libraries",
  "Boilerplates / Templates":
    "Starter templates and boilerplates for quick project setup",
};

const ITEMS_PER_PAGE_OPTIONS = [18, 27, 36, 45];

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params);
  const [items, setItems] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<Resource[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    bookmarkedItems,
    toggleBookmark,
    isLoading: isBookmarkLoading,
  } = useBookmarks();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const categorySlug = resolvedParams.category;
  const categoryName = slugToCategoryName(categorySlug);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const fetchedResources = await fetchAndParseReadme();

        const categoryItems = fetchedResources.filter(
          (item) => item.category === categoryName,
        );

        setItems(categoryItems);
        setFilteredItems(categoryItems);
      } catch (error) {
        console.error("Error fetching category items:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [categoryName]);

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

  if (isLoading) {
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
              <div
                key={i}
                className="border rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4"
              >
                <div className="space-y-2">
                  <Skeleton className="h-5 sm:h-6 w-3/4" />
                  <Skeleton className="h-4 sm:h-5 w-20" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 sm:h-4 w-full" />
                  <Skeleton className="h-3 sm:h-4 w-5/6" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-md" />
                  <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-md" />
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
        title={categoryName}
        description={
          CATEGORY_DESCRIPTIONS[categoryName] ||
          "A collection of shadcn/ui related resources"
        }
        breadcrumbs={[
          { label: "Categories", href: "/categories" },
          { label: categoryName, href: `/categories/${categorySlug}` },
        ]}
        actions={
          <div className="space-y-3 sm:space-y-4 w-full">
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <span>
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Category</span>
            </div>
            <div className="w-full p-2 max-w-md">
              <Input
                type="text"
                placeholder="Search within this category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        }
      />

      <div className="min-h-screen mb-6 sm:mb-8">
        <ItemGrid
          items={currentItems}
          bookmarkedItems={bookmarkedItems}
          onBookmark={toggleBookmark}
          isBookmarkLoading={isBookmarkLoading}
        />
      </div>

      {filteredItems.length > 0 && (
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

      <div className="text-xs sm:text-sm text-muted-foreground text-center mt-4 sm:mt-6">
        Showing {indexOfFirstItem + 1} -{" "}
        {Math.min(indexOfLastItem, filteredItems.length)} of{" "}
        {filteredItems.length} items
      </div>

      {filteredItems.length === 0 && debouncedSearchQuery && (
        <div className="text-center py-8 sm:py-12 px-4">
          <p className="text-muted-foreground mb-4 text-sm sm:text-base break-words">
            No items found for "{debouncedSearchQuery}"
          </p>
          <Button
            variant="outline"
            onClick={() => setSearchQuery("")}
            className="text-sm sm:text-base"
          >
            Clear search
          </Button>
        </div>
      )}
    </motion.div>
  );
}
