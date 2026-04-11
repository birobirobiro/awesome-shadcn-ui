import { useEffect, useState } from "react";

/** Breakpoint in pixels for mobile detection */
const MOBILE_BREAKPOINT = 768;

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
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
