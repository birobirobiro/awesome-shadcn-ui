"use client";

import { CategoryIcon } from "@/components/category-icon";

import { ItemGrid, SPONSOR_INTERVAL } from "@/components/item-grid";
import { PageHeader } from "@/components/layout/page-header";
import { PaginationControls } from "@/components/pagination-controls";
import { SponsorRail } from "@/components/sponsor-rail";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useBookmarks } from "@/hooks/use-bookmark";
import { useDebounce } from "@/hooks/use-debounce";
import { type Resource } from "@/hooks/use-readme";
import { Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

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
  "Websites and Portfolios":
    "Real-world examples and inspiration for your projects",
  Platforms: "Platforms and services that integrate with shadcn/ui",
  Ports: "Ports of shadcn/ui to other frameworks and technologies",
  "Design System": "Complete design systems and component libraries",
  "Boilerplates / Templates":
    "Starter templates and boilerplates for quick project setup",
};

const ITEMS_PER_PAGE_OPTIONS = [20, 40, 60, 80];

function itemSlotsFor(itemsPerPage: number) {
  const sponsorsPerPage = Math.ceil(itemsPerPage / (SPONSOR_INTERVAL + 1));
  return itemsPerPage - sponsorsPerPage;
}

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[1]);
  const {
    bookmarkedItems,
    toggleBookmark,
    isLoading: isBookmarkLoading,
  } = useBookmarks();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredItems = useMemo(() => {
    if (!debouncedSearchQuery) return items;

    return items.filter(
      (item) =>
        item.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        item.description
          ?.toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()),
    );
  }, [debouncedSearchQuery, items]);

  const itemsPerPageActual = itemSlotsFor(itemsPerPage);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / itemsPerPageActual),
  );
  const safePage = Math.min(currentPage, totalPages);
  const indexOfLastItem = safePage * itemsPerPageActual;
  const indexOfFirstItem = indexOfLastItem - itemsPerPageActual;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const showingFrom = filteredItems.length === 0 ? 0 : indexOfFirstItem + 1;
  const showingTo = Math.min(indexOfLastItem, filteredItems.length);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleItemsPerPageChange = useCallback((value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  }, []);

  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  return (
    <div className="shell">
      <PageHeader
        title={categoryName}
        icon={<CategoryIcon category={categoryName} />}
        description={
          CATEGORY_DESCRIPTIONS[categoryName] ||
          "A collection of shadcn/ui related resources"
        }
        breadcrumbs={[
          { label: "Categories", href: "/categories" },
          { label: categoryName, href: `/categories/${categorySlug}` },
        ]}
        actions={
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? "resource" : "resources"} in
              this category
            </p>
            <InputGroup className="catalog-search catalog-search--page w-full sm:max-w-sm">
              <InputGroupInput
                type="search"
                placeholder="Search this category…"
                value={searchQuery}
                onChange={(event) =>
                  handleSearchQueryChange(event.target.value)
                }
                aria-label={`Search ${categoryName}`}
                className="w-full"
              />
              <InputGroupAddon>
                <Search aria-hidden="true" />
              </InputGroupAddon>
            </InputGroup>
          </div>
        }
      />

      <div className="category-layout">
        <SponsorRail />
        <div className="category-main">
          <div className="catalog-results">
            <ItemGrid
              items={currentItems}
              bookmarkedItems={bookmarkedItems}
              onBookmark={toggleBookmark}
              isBookmarkLoading={isBookmarkLoading}
              startIndex={indexOfFirstItem}
              pageSize={totalPages > 1 ? itemsPerPage : undefined}
            />
          </div>

          {filteredItems.length === 0 && debouncedSearchQuery && (
            <div className="mt-4">
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            </div>
          )}

          {filteredItems.length > 0 && (
            <PaginationControls
              currentPage={safePage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              handlePageChange={handlePageChange}
              handleItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
            />
          )}

          <div className="catalog-foot">
            <span className="catalog-foot__count">
              Showing {showingFrom} to {showingTo} of {filteredItems.length}
            </span>
            <span>{categoryName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
