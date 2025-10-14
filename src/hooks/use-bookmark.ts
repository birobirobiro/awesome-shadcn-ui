import { useCallback, useEffect, useRef, useState } from "react";

export function useBookmarks() {
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastClickedRef = useRef<{ id: string; timestamp: number } | null>(null);

  useEffect(() => {
    try {
      const storedBookmarks = localStorage.getItem("bookmarkedItems");
      if (storedBookmarks) {
        const parsed = JSON.parse(storedBookmarks);
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

      const now = Date.now();
      if (
        lastClickedRef.current &&
        lastClickedRef.current.id === id &&
        now - lastClickedRef.current.timestamp < 300
      ) {
        return;
      }
      lastClickedRef.current = { id, timestamp: now };

      setBookmarkedItems((prevBookmarks) => {
        const isCurrentlyBookmarked = prevBookmarks.includes(id);
        const newBookmarks = isCurrentlyBookmarked
          ? prevBookmarks.filter((bookmarkId) => bookmarkId !== id)
          : [...prevBookmarks, id];

        try {
          localStorage.setItem("bookmarkedItems", JSON.stringify(newBookmarks));
          setError(null);
        } catch (err) {
          setError("Failed to save bookmark");
          return prevBookmarks;
        }

        return newBookmarks;
      });
    },
    [isLoading],
  );

  const clearBookmarks = useCallback(() => {
    setBookmarkedItems([]);
    try {
      localStorage.removeItem("bookmarkedItems");
    } catch (err) {
      setError("Failed to clear bookmarks");
    }
  }, []);

  const isBookmarked = useCallback(
    (id: string) => {
      return bookmarkedItems.includes(id);
    },
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
