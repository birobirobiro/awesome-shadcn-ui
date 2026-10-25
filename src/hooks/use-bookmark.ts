import {
  useCallback,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

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
function subscribeToBookmarks(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("bookmarks-changed", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("bookmarks-changed", callback);
  };
}

function getBookmarkSnapshot(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}
const getServerBookmarkSnapshot = () => null;

export function useBookmarks(): UseBookmarksReturn {
  const snapshot = useSyncExternalStore(
    subscribeToBookmarks,
    getBookmarkSnapshot,
    getServerBookmarkSnapshot,
  );
  const isLoading = snapshot === null;
  const bookmarkedItems = useMemo<string[]>(() => {
    try {
      const value: unknown = JSON.parse(snapshot ?? "[]");
      return Array.isArray(value) &&
        value.every((item) => typeof item === "string")
        ? value
        : [];
    } catch {
      return [];
    }
  }, [snapshot]);
  const [error, setError] = useState<string | null>(null);
  const lastClickRef = useRef<{ id: string; time: number } | null>(null);

  const toggleBookmark = useCallback(
    (id: string) => {
      if (isLoading) return;
      const now = Date.now();
      if (
        lastClickRef.current?.id === id &&
        now - lastClickRef.current.time < DEBOUNCE_DELAY
      )
        return;
      lastClickRef.current = { id, time: now };
      const next = bookmarkedItems.includes(id)
        ? bookmarkedItems.filter((bookmarkId) => bookmarkId !== id)
        : [...bookmarkedItems, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event("bookmarks-changed"));
        setError(null);
      } catch {
        setError("Failed to save bookmark");
      }
    },
    [bookmarkedItems, isLoading],
  );

  const clearBookmarks = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event("bookmarks-changed"));
      setError(null);
    } catch {
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
