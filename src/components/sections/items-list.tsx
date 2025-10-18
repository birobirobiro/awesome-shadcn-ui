"use client";

import { isValid, parseISO } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

import { SortOption } from "@/components/sort";
import { useBookmarks } from "@/hooks/use-bookmark";
import { useDebounce } from "@/hooks/use-debounce";
import { Resource } from "@/hooks/use-readme";
import { ItemGrid } from "../item-grid";
import { PaginationControls } from "../pagination-controls";
import { SearchFilterControls } from "../search-filter-controls";
import { Skeleton } from "../ui/skeleton";

const ITEMS_PER_PAGE_OPTIONS = [18, 27, 36, 45];

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
  const [filteredItems, setFilteredItems] = useState<Resource[]>(initialItems);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("date-desc");
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const {
    bookmarkedItems,
    toggleBookmark,
    isLoading: isBookmarkLoading,
  } = useBookmarks();

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        label: category.title,
        value: category.title,
      })),
    [categories],
  );

  const sortItems = useCallback(
    (items: Resource[]): Resource[] => {
      return [...items].sort((a, b) => {
        const aBookmarked = bookmarkedItems.includes(a.id);
        const bBookmarked = bookmarkedItems.includes(b.id);
        if (aBookmarked !== bBookmarked) return aBookmarked ? -1 : 1;

        const [field, direction] = sortOption.split("-") as [
          "date" | "name",
          "asc" | "desc",
        ];

        if (field === "name") {
          const nameA = a.name?.toLowerCase() || "";
          const nameB = b.name?.toLowerCase() || "";
          const result = nameA.localeCompare(nameB);
          return direction === "asc" ? result : -result;
        } else {
          const dateA =
            a.date && a.date !== "Unknown" ? parseISO(a.date) : new Date(0);
          const dateB =
            b.date && b.date !== "Unknown" ? parseISO(b.date) : new Date(0);

          if (!isValid(dateA) && !isValid(dateB)) return 0;
          if (!isValid(dateA)) return direction === "asc" ? -1 : 1;
          if (!isValid(dateB)) return direction === "asc" ? 1 : -1;

          return direction === "asc"
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        }
      });
    },
    [bookmarkedItems, sortOption],
  );

  const filterAndSortItems = useCallback(() => {
    let filtered = [...initialItems];

    if (debouncedSearchQuery) {
      const lowercaseQuery = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.name?.toLowerCase() || "").includes(lowercaseQuery) ||
          (item.description?.toLowerCase() || "").includes(lowercaseQuery),
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.category),
      );
    }

    const sortedItems = sortItems(filtered);

    setFilteredItems(sortedItems);
    setCurrentPage(1);
  }, [initialItems, debouncedSearchQuery, selectedCategories, sortItems]);

  // Update filteredItems when initialItems change
  useEffect(() => {
    setFilteredItems(initialItems);
    setCurrentPage(1);
  }, [initialItems]);

  useEffect(() => {
    filterAndSortItems();
  }, [filterAndSortItems]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      filterAndSortItems();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Set loading to false when initialItems are available
  useEffect(() => {
    if (initialItems.length > 0) {
      setIsLoading(false);
    }
  }, [initialItems]);

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

  const handleSortChange = useCallback(
    (option: SortOption) => {
      setSortOption(option);

      const sorted = sortItems(
        filteredItems.filter((item) => {
          if (
            selectedCategories.length > 0 &&
            !selectedCategories.includes(item.category)
          ) {
            return false;
          }

          if (debouncedSearchQuery) {
            const lowercaseQuery = debouncedSearchQuery.toLowerCase();
            return (
              (item.name?.toLowerCase() || "").includes(lowercaseQuery) ||
              (item.description?.toLowerCase() || "").includes(lowercaseQuery)
            );
          }

          return true;
        }),
      );

      setFilteredItems(sorted);
    },
    [filteredItems, sortItems, selectedCategories, debouncedSearchQuery],
  );

  // Get grid column classes
  const getGridClasses = useCallback(() => {
    return "sm:grid-cols-2 lg:grid-cols-3";
  }, []);

  // Get item card height
  const getCardHeightClass = useCallback(() => {
    return "min-h-[250px]";
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <SearchFilterControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryOptions={categoryOptions}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            sortOption={sortOption}
            onSortChange={handleSortChange}
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${isLoading ? "loading" : "loaded"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            layout
          >
            {isLoading ? (
              <div className={`grid gap-6 ${getGridClasses()}`}>
                {[...Array(itemsPerPage)].map((_, index) => (
                  <Card
                    key={index}
                    className={`flex flex-col h-full ${getCardHeightClass()} overflow-hidden`}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6" />
                    </CardContent>
                    <CardFooter className="pt-4">
                      <Skeleton className="h-9 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <ItemGrid
                items={currentItems}
                bookmarkedItems={bookmarkedItems}
                onBookmark={toggleBookmark}
                isBookmarkLoading={isBookmarkLoading}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {filteredItems.length > 0 && (
        <motion.div variants={itemVariants}>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            handlePageChange={handlePageChange}
            handleItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
          />
        </motion.div>
      )}

      <motion.div
        variants={itemVariants}
        className="text-sm text-muted-foreground text-center"
      >
        Showing {indexOfFirstItem + 1} -{" "}
        {Math.min(indexOfLastItem, filteredItems.length)} of{" "}
        {filteredItems.length} items
      </motion.div>
    </motion.div>
  );
}
