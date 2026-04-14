import { useEffect, useState } from "react";

/**
 * Debounces a value by delaying updates until after the specified delay.
 *
 * Useful for preventing excessive API calls or expensive computations
 * while the user is still typing or interacting.
 *
 * @typeParam T - The type of value being debounced
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds before updating the debounced value
 * @returns The debounced value
 *
 * @example
 * ```tsx
 * const [searchQuery, setSearchQuery] = useState('')
 * const debouncedQuery = useDebounce(searchQuery, 300)
 *
 * useEffect(() => {
 *   // Only fires 300ms after user stops typing
 *   fetchResults(debouncedQuery)
 * }, [debouncedQuery])
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
