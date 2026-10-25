"use client";

import { Skeleton } from "@/components/ui/skeleton";

import { ItemGrid, SPONSOR_INTERVAL } from "@/components/item-grid";
import { PageHeader } from "@/components/layout/page-header";
import { PaginationControls } from "@/components/pagination-controls";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useBookmarks } from "@/hooks/use-bookmark";
import { useDebounce } from "@/hooks/use-debounce";
import { fetchAndParseReadme, type Resource } from "@/hooks/use-readme";
import { Bookmark, Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

const ITEMS_PER_PAGE_OPTIONS = [20, 40, 60, 80];

function itemSlotsFor(itemsPerPage: number) {
  const sponsorsPerPage = Math.ceil(itemsPerPage / (SPONSOR_INTERVAL + 1));
  return itemsPerPage - sponsorsPerPage;
}

function BookmarksSkeleton() {
  return (
    <div className="resource-list" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="skeleton-row">
          <Skeleton className="skeleton--index" />
          <div>
            <Skeleton className="skeleton--title" />
            <Skeleton className="skeleton--line" />
            <Skeleton className="skeleton--line" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BookmarksPage() {
  const [items, setItems] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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
        setCurrentPage(1);
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

  const filteredItems = useMemo(() => {
    const query = debouncedSearchQuery.toLowerCase();
    return items.filter(
      (item) =>
        !query ||
        item.name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query),
    );
  }, [debouncedSearchQuery, items]);

  const itemsPerPageActual = itemSlotsFor(itemsPerPage);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPageActual);
  const indexOfLastItem = currentPage * itemsPerPageActual;
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

  const handleClearBookmarks = useCallback(() => {
    clearBookmarks();
    setShowClearDialog(false);
    setSearchQuery("");
  }, [clearBookmarks]);

  if (isLoading || isBookmarkLoading) {
    return (
      <div className="shell">
        <PageHeader
          title="Bookmarks"
          description="Your saved shadcn/ui resources."
          breadcrumbs={[{ label: "Bookmarks", href: "/bookmarks" }]}
        />
        <div className="catalog-results py-8">
          <BookmarksSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="shell">
      <PageHeader
        title="Bookmarks"
        description="Your saved shadcn/ui resources. Bookmarks stay in this browser."
        breadcrumbs={[{ label: "Bookmarks", href: "/bookmarks" }]}
        actions={
          <div className="flex w-full flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {items.length} {items.length === 1 ? "bookmark" : "bookmarks"}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <InputGroup className="catalog-search w-full sm:w-64">
                  <InputGroupInput
                    type="search"
                    placeholder="Search bookmarks…"
                    value={searchQuery}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                      setCurrentPage(1);
                    }}
                    aria-label="Search bookmarks"
                    className="w-full"
                  />
                  <InputGroupAddon>
                    <Search aria-hidden="true" />
                  </InputGroupAddon>
                </InputGroup>
                {items.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setShowClearDialog(true)}
                    className="h-10 whitespace-nowrap"
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </div>
          </div>
        }
      />

      {items.length === 0 ? (
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Bookmark className="h-4 w-4" aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>
              <h2>No bookmarks yet</h2>
            </EmptyTitle>
            <EmptyDescription>
              Start saving your favorite shadcn/ui resources by clicking the
              bookmark icon on any item.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild className="mt-2">
              <Link prefetch={false} href="/">
                Browse resources
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : filteredItems.length === 0 && debouncedSearchQuery ? (
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search className="h-4 w-4" aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>
              <h2>No results found</h2>
            </EmptyTitle>
            <EmptyDescription>
              No bookmarks match your search for “{debouncedSearchQuery}”.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => setSearchQuery("")}
            >
              Clear search
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
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
      )}

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

      {filteredItems.length > 0 && (
        <div className="catalog-foot">
          <span className="catalog-foot__count">
            Showing {showingFrom} to {showingTo} of {filteredItems.length}
          </span>
          <span>{filteredItems.length === 1 ? "bookmark" : "bookmarks"}</span>
        </div>
      )}

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all bookmarks?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all your bookmarked items. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleClearBookmarks}
            >
              Clear all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
