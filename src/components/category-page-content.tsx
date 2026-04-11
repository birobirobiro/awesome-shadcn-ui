"use client";

import { ItemGrid } from "@/components/item-grid";
import { PageHeader } from "@/components/layout/page-header";
import { PaginationControls } from "@/components/pagination-controls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBookmarks } from "@/hooks/use-bookmark";
import { useDebounce } from "@/hooks/use-debounce";
import { type Resource } from "@/hooks/use-readme";
import { useCallback, useEffect, useState } from "react";

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

const ITEMS_PER_PAGE_OPTIONS = [20, 40, 60, 80];

interface CategoryPageContentProps {
  items: Resource[];
  categoryName: string;
  categorySlug: string;
}

export function CategoryPageContent({
  items,
  categoryName,
  categorySlug,
}: CategoryPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<Resource[]>(items);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[1]);
  const {
    bookmarkedItems,
    toggleBookmark,
    isLoading: isBookmarkLoading,
  } = useBookmarks();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

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

  return (
    <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-8">
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
            <div className="w-full max-w-md">
              <Input
                type="text"
                placeholder="Search within this category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10"
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
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          handlePageChange={handlePageChange}
          handleItemsPerPageChange={handleItemsPerPageChange}
          itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
        />
      )}

      <div className="text-xs sm:text-sm text-muted-foreground text-center mt-4 sm:mt-6">
        Showing {indexOfFirstItem + 1} -{" "}
        {Math.min(indexOfLastItem, filteredItems.length)} of{" "}
        {filteredItems.length} items
      </div>

      {filteredItems.length === 0 && debouncedSearchQuery && (
        <div className="text-center py-8 sm:py-12 px-4">
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">
            No items found for "{debouncedSearchQuery}"
          </p>
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Clear search
          </Button>
        </div>
      )}
    </div>
  );
}
