import { useSyncExternalStore } from "react";

/** Breakpoint in pixels for mobile detection */
const MOBILE_BREAKPOINT = 768;

function subscribe(callback: () => void) {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

function getServerSnapshot() {
  return false;
}

/**
 * Detects if the current viewport is mobile-sized.
 *
 * Uses matchMedia for efficient viewport change detection.
 * Returns false during SSR/hydration to prevent layout shifts.
 *
 * @returns `true` if viewport width is less than 768px
 *
 * @example
 * ```tsx
 * const isMobile = useIsMobile()
 *
 * return isMobile ? <MobileNav /> : <DesktopNav />
 * ```
 */
export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
