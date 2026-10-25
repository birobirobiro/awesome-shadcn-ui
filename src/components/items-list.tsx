"use client";

import { isValid, parseISO } from "date-fns";
import { useCallback, useMemo, useState, useSyncExternalStore } from "react";

import { SponsorRail } from "@/components/sponsor-rail";

import { SortOption } from "@/components/sort";
import { useBookmarks } from "@/hooks/use-bookmark";
import { useDebounce } from "@/hooks/use-debounce";
import { Resource } from "@/hooks/use-readme";
import { ItemGrid, SPONSOR_INTERVAL } from "./item-grid";
import { PaginationControls } from "./pagination-controls";
import { SearchFilterControls } from "./search-filter-controls";

// The home page is statically rendered; read URL state after hydration.
function subscribeToFilters(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener("catalog-filters", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("catalog-filters", callback);
  };
}
const getFilterSnapshot = () => window.location.search;
const getServerFilterSnapshot = () => "";

function updateFilters(update: (params: URLSearchParams) => void) {
  const url = new URL(window.location.href);
  update(url.searchParams);
  window.history.replaceState(
    null,
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );
  window.dispatchEvent(new Event("catalog-filters"));
}

const ITEMS_PER_PAGE_OPTIONS = [20, 40, 60, 80];

// Each page renders `itemsPerPage` cards total. Sponsors appear at item index
// 0, SPONSOR_INTERVAL, 2*SPONSOR_INTERVAL, ... so each full block of
// SPONSOR_INTERVAL+1 slots contains 1 sponsor + SPONSOR_INTERVAL items.
function itemSlotsFor(itemsPerPage: number) {
  const sponsorsPerPage = Math.ceil(itemsPerPage / (SPONSOR_INTERVAL + 1));
  return itemsPerPage - sponsorsPerPage;
}

interface Category {
  title: string;
  items: Resource[];
}

interface ItemListProps {
  items: Resource[];
  categories: Category[];
}

export default function ItemList({
  items: initialItems,
  categories,
}: ItemListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[1]);
  const filterSnapshot = useSyncExternalStore(
    subscribeToFilters,
    getFilterSnapshot,
    getServerFilterSnapshot,
  );
  const params = useMemo(
    () => new URLSearchParams(filterSnapshot),
    [filterSnapshot],
  );
  const searchQuery = params.get("q") ?? "";
  const selectedCategories = useMemo(
    () =>
      params
        .getAll("category")
        .filter((value) =>
          categories.some((category) => category.title === value),
        ),
    [params, categories],
  );
  const requestedSort = params.get("sort");
  const sortOption: SortOption = [
    "date-desc",
    "date-asc",
    "name-asc",
    "name-desc",
    "stars-desc",
  ].includes(requestedSort ?? "")
    ? (requestedSort as SortOption)
    : "date-desc";

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const {
    bookmarkedItems,
    toggleBookmark,
    isLoading: isBookmarkLoading,
  } = useBookmarks();

  const searchMatchedItems = useMemo(() => {
    const query = debouncedSearchQuery.trim().toLowerCase();
    return initialItems.filter(
      (item) =>
        !query ||
        item.name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query),
    );
  }, [initialItems, debouncedSearchQuery]);

  const categoryOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of searchMatchedItems) {
      counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    }
    return categories.map((category) => ({
      label: category.title,
      value: category.title,
      count: counts.get(category.title) ?? 0,
    }));
  }, [categories, searchMatchedItems]);

  const sortItems = useCallback(
    (items: Resource[]): Resource[] => {
      return [...items].sort((a, b) => {
        const [field, direction] = sortOption.split("-") as [
          "date" | "name" | "stars",
          "asc" | "desc",
        ];

        if (field === "stars") {
          // Resources without a GitHub repo have no star count and sort last
          const starsA = a.stars ?? -1;
          const starsB = b.stars ?? -1;
          if (starsA !== starsB) {
            return direction === "asc" ? starsA - starsB : starsB - starsA;
          }
          return (a.name?.toLowerCase() || "").localeCompare(
            b.name?.toLowerCase() || "",
          );
        }

        if (field === "name") {
          const nameA = a.name?.toLowerCase() || "";
          const nameB = b.name?.toLowerCase() || "";
          const result = nameA.localeCompare(nameB);
          return direction === "asc" ? result : -result;
        }

        const dateA =
          a.date && a.date !== "Unknown" ? parseISO(a.date) : new Date(0);
        const dateB =
          b.date && b.date !== "Unknown" ? parseISO(b.date) : new Date(0);

        if (!isValid(dateA) && !isValid(dateB)) return 0;
        if (!isValid(dateA)) return direction === "asc" ? -1 : 1;
        if (!isValid(dateB)) return direction === "asc" ? 1 : -1;

        const dateDiff =
          direction === "asc"
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        if (dateDiff !== 0) return dateDiff;

        return direction === "asc" ? a.order - b.order : b.order - a.order;
      });
    },
    [sortOption],
  );

  const filteredItems = useMemo(() => {
    let filtered = searchMatchedItems;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.category),
      );
    }

    return sortItems(filtered);
  }, [searchMatchedItems, selectedCategories, sortItems]);

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

  const handleSortChange = useCallback((option: SortOption) => {
    updateFilters((params) => {
      if (option === "date-desc") params.delete("sort");
      else params.set("sort", option);
    });
    setCurrentPage(1);
  }, []);

  const handleSearchQueryChange = useCallback((query: string) => {
    updateFilters((params) => {
      if (query) params.set("q", query);
      else params.delete("q");
    });
    setCurrentPage(1);
  }, []);

  const handleCategoriesChange = useCallback((categories: string[]) => {
    updateFilters((params) => {
      params.delete("category");
      categories.forEach((category) => params.append("category", category));
    });
    setCurrentPage(1);
  }, []);

  return (
    <section id="index" className="catalog" aria-labelledby="catalog-title">
      <div className="shell">
        <div className="catalog-head">
          <div>
            <h1 id="catalog-title" className="text-2xl font-medium sm:text-3xl">
              Resources
            </h1>
            <p className="catalog-head__meta">
              Browse {initialItems.length} resources across {categories.length}{" "}
              categories.
            </p>
          </div>
        </div>

        <SearchFilterControls
          searchQuery={searchQuery}
          setSearchQuery={handleSearchQueryChange}
          categoryOptions={categoryOptions}
          selectedCategories={selectedCategories}
          setSelectedCategories={handleCategoriesChange}
          sortOption={sortOption}
          onValueChange={handleSortChange}
          totalItems={searchMatchedItems.length}
          resultCount={filteredItems.length}
          onClearFilters={() => {
            updateFilters((params) => {
              params.delete("q");
              params.delete("category");
              params.delete("sort");
            });
            setCurrentPage(1);
          }}
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
              <span>
                {selectedCategories.length > 0
                  ? `${selectedCategories.length} categories selected`
                  : "All categories"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
