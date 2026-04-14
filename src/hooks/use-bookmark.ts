import { useCallback, useEffect, useRef, useState } from "react";

/** Local storage key for persisting bookmarks */
const STORAGE_KEY = "bookmarkedItems";

/** Debounce delay in ms to prevent rapid double-clicks */
const DEBOUNCE_DELAY = 300;

/**
 * Return type for the useBookmarks hook
 */
export interface UseBookmarksReturn {
  /** Array of bookmarked item IDs */
  bookmarkedItems: string[];
  /** Toggle bookmark status for an item */
  toggleBookmark: (id: string) => void;
  /** Clear all bookmarks */
  clearBookmarks: () => void;
  /** Check if an item is bookmarked */
  isBookmarked: (id: string) => boolean;
  /** Loading state during initial hydration */
  isLoading: boolean;
  /** Error message if any operation fails */
  error: string | null;
}

/**
 * Hook for managing bookmarked items with localStorage persistence.
 *
 * Features:
 * - Persists bookmarks to localStorage
 * - Debounces rapid clicks to prevent double-toggling
 * - Handles hydration gracefully with loading state
 *
 * @returns Bookmark state and actions
 *
 * @example
 * ```tsx
 * const { bookmarkedItems, toggleBookmark, isBookmarked } = useBookmarks()
 *
 * return (
 *   <button onClick={() => toggleBookmark(item.id)}>
 *     {isBookmarked(item.id) ? 'Bookmarked' : 'Bookmark'}
 *   </button>
 * )
 * ```
 */
export function useBookmarks(): UseBookmarksReturn {
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastClickRef = useRef<{ id: string; time: number } | null>(null);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          Array.isArray(parsed) &&
          parsed.every((item) => typeof item === "string")
        ) {
          setBookmarkedItems(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to load bookmarks:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleBookmark = useCallback(
    (id: string) => {
      if (isLoading) return;

      // Debounce rapid clicks on the same item
      const now = Date.now();
      if (
        lastClickRef.current &&
        lastClickRef.current.id === id &&
        now - lastClickRef.current.time < DEBOUNCE_DELAY
      ) {
        return;
      }
      lastClickRef.current = { id, time: now };

      setBookmarkedItems((prev) => {
        const isCurrentlyBookmarked = prev.includes(id);
        const next = isCurrentlyBookmarked
          ? prev.filter((bookmarkId) => bookmarkId !== id)
          : [...prev, id];

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          setError(null);
        } catch (err) {
          setError("Failed to save bookmark");
          return prev;
        }

        return next;
      });
    },
    [isLoading],
  );

  const clearBookmarks = useCallback(() => {
    setBookmarkedItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      setError(null);
    } catch (err) {
      setError("Failed to clear bookmarks");
    }
  }, []);

  const isBookmarked = useCallback(
    (id: string) => bookmarkedItems.includes(id),
    [bookmarkedItems],
  );

  return {
    bookmarkedItems,
    toggleBookmark,
    clearBookmarks,
    isBookmarked,
    isLoading,
    error,
  };
}
