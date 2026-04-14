"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  Direction as DirectionPrimitive,
  Slot as SlotPrimitive,
} from "radix-ui";
import * as React from "react";
import { useComposedRefs } from "@/lib/compose-refs";
import { cn } from "@/lib/utils";

const ROOT_NAME = "Marquee";
const CONTENT_NAME = "MarqueeContent";

type Side = "left" | "right" | "top" | "bottom";
type Orientation = "horizontal" | "vertical";
type Direction = "ltr" | "rtl";

type RootElement = React.ComponentRef<typeof Marquee>;
type ContentElement = React.ComponentRef<typeof MarqueeContent>;

interface Dimensions {
  width: number;
  height: number;
}

interface ElementDimensions {
  rootSize: number;
  contentSize: number;
}

function createResizeObserverStore() {
  const listeners = new Set<() => void>();
  let observer: ResizeObserver | null = null;
  const elements = new Map<Element, Dimensions>();
  const refCounts = new Map<Element, number>();
  const isSupported = typeof ResizeObserver !== "undefined";
  let notificationScheduled = false;

  const snapshotCache = new WeakMap<
    Element,
    WeakMap<
      Element,
      { horizontal: ElementDimensions; vertical: ElementDimensions }
    >
  >();

  function notify() {
    if (notificationScheduled) return;
    notificationScheduled = true;
    queueMicrotask(() => {
      notificationScheduled = false;
      for (const callback of listeners) {
        callback();
      }
    });
  }

  function cleanup() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    elements.clear();
    refCounts.clear();
  }

  function subscribe(callback: () => void) {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
      if (listeners.size === 0) {
        cleanup();
      }
    };
  }

  function getSnapshot(
    rootElement: RootElement | null,
    contentElement: ContentElement | null,
    orientation: Orientation,
  ): ElementDimensions | null {
    if (!rootElement || !contentElement) return null;

    const rootDims = elements.get(rootElement);
    const contentDims = elements.get(contentElement);

    if (!rootDims || !contentDims) return null;

    const rootSize =
      orientation === "vertical" ? rootDims.height : rootDims.width;
    const contentSize =
      orientation === "vertical" ? contentDims.height : contentDims.width;

    let rootCache = snapshotCache.get(rootElement);
    if (!rootCache) {
      rootCache = new WeakMap();
      snapshotCache.set(rootElement, rootCache);
    }

    let contentCache = rootCache.get(contentElement);
    if (!contentCache) {
      contentCache = {
        horizontal: { rootSize: -1, contentSize: -1 },
        vertical: { rootSize: -1, contentSize: -1 },
      };
      rootCache.set(contentElement, contentCache);
    }

    const cached = contentCache[orientation];
    if (cached.rootSize === rootSize && cached.contentSize === contentSize) {
      return cached;
    }

    const snapshot = { rootSize, contentSize };
    contentCache[orientation] = snapshot;
    return snapshot;
  }

  function observe(
    rootElement: RootElement | null,
    contentElement: Element | null,
  ) {
    if (!isSupported || !rootElement || !contentElement) return;

    if (!observer) {
      observer = new ResizeObserver((entries) => {
        let hasChanged = false;

        for (const entry of entries) {
          const element = entry.target;
          const { width, height } = entry.contentRect;

          const currentData = elements.get(element);

          if (
            !currentData ||
            currentData.width !== width ||
            currentData.height !== height
          ) {
            elements.set(element, { width, height });
            hasChanged = true;
          }
        }

        if (hasChanged) {
          notify();
        }
      });
    }

    refCounts.set(rootElement, (refCounts.get(rootElement) ?? 0) + 1);
    refCounts.set(contentElement, (refCounts.get(contentElement) ?? 0) + 1);

    observer.observe(rootElement);
    observer.observe(contentElement);

    const rootRect = rootElement.getBoundingClientRect();
    const contentRect = contentElement.getBoundingClientRect();

    const rootData = { width: rootRect.width, height: rootRect.height };
    const contentData = {
      width: contentRect.width,
      height: contentRect.height,
    };

    elements.set(rootElement, rootData);
    elements.set(contentElement, contentData);

    if (
      rootData.width > 0 &&
      rootData.height > 0 &&
      contentData.width > 0 &&
      contentData.height > 0
    ) {
      notify();
    }
  }

  function unobserve(
    rootElement: RootElement | null,
    contentElement: Element | null,
  ) {
    if (!observer || !rootElement || !contentElement) return;

    const rootCount = (refCounts.get(rootElement) ?? 1) - 1;
    const contentCount = (refCounts.get(contentElement) ?? 1) - 1;

    if (rootCount <= 0) {
      observer.unobserve(rootElement);
      elements.delete(rootElement);
      refCounts.delete(rootElement);
    } else {
      refCounts.set(rootElement, rootCount);
    }

    if (contentCount <= 0) {
      observer.unobserve(contentElement);
      elements.delete(contentElement);
      refCounts.delete(contentElement);
    } else {
      refCounts.set(contentElement, contentCount);
    }
  }

  return {
    subscribe,
    getSnapshot,
    observe,
    unobserve,
  };
}

const resizeObserverStore = createResizeObserverStore();

function useResizeObserverStore(
  rootRef: React.RefObject<RootElement | null>,
  contentRef: React.RefObject<ContentElement | null>,
  orientation: Orientation,
) {
  const onSubscribe = React.useCallback(
    (callback: () => void) => resizeObserverStore.subscribe(callback),
    [],
  );

  const getSnapshot = React.useCallback(
    () =>
      resizeObserverStore.getSnapshot(
        rootRef.current,
        contentRef.current,
        orientation,
      ),
    [rootRef, contentRef, orientation],
  );

  return React.useSyncExternalStore(onSubscribe, getSnapshot, getSnapshot);
}

interface DivProps extends React.ComponentProps<"div"> {
  asChild?: boolean;
}

interface MarqueeContextValue {
  side: Side;
  orientation: Orientation;
  dir: Direction;
  speed: number;
  loopCount: number;
  contentRef: React.RefObject<ContentElement | null>;
  rootRef: React.RefObject<RootElement | null>;
  autoFill: boolean;
  pauseOnHover: boolean;
  pauseOnKeyboard: boolean;
  reverse: boolean;
  paused: boolean;
}

const MarqueeContext = React.createContext<MarqueeContextValue | null>(null);

function useMarqueeContext(consumerName: string) {
  const context = React.useContext(MarqueeContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ROOT_NAME}\``);
  }
  return context;
}

interface MarqueeProps extends DivProps {
  side?: Side;
  dir?: Direction;
  speed?: number;
  delay?: number;
  loopCount?: number;
  gap?: string | number;
  autoFill?: boolean;
  pauseOnHover?: boolean;
  pauseOnKeyboard?: boolean;
  reverse?: boolean;
}

function Marquee(props: MarqueeProps) {
  const {
    side = "left",
    dir: dirProp,
    speed = 50,
    delay = 0,
    loopCount = 0,
    gap = "1rem",
    asChild,
    autoFill = false,
    pauseOnHover = false,
    pauseOnKeyboard = false,
    reverse = false,
    className,
    style: styleProp,
    ref,
    ...marqueeProps
  } = props;

  const orientation: Orientation =
    side === "top" || side === "bottom" ? "vertical" : "horizontal";

  const dir = DirectionPrimitive.useDirection(dirProp);

  const rootRef = React.useRef<RootElement>(null);
  const contentRef = React.useRef<ContentElement>(null);
  const composedRef = useComposedRefs(ref, rootRef);

  const [paused, setPaused] = React.useState(false);

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (pauseOnKeyboard && event.key === " ") {
        event.preventDefault();
        setPaused((prev) => !prev);
      }
    },
    [pauseOnKeyboard],
  );

  const dimensions = useResizeObserverStore(rootRef, contentRef, orientation);

  const duration = React.useMemo(() => {
    const safeSpeed = Math.max(0.001, speed);

    if (!dimensions) {
      const defaultDistance = autoFill ? 1000 : 2000;
      return defaultDistance / safeSpeed;
    }

    const { rootSize, contentSize } = dimensions;

    if (autoFill) {
      const multiplier =
        contentSize < rootSize ? Math.ceil(rootSize / contentSize) : 1;
      return (contentSize * multiplier) / safeSpeed;
    } else {
      return contentSize < rootSize
        ? rootSize / safeSpeed
        : contentSize / safeSpeed;
    }
  }, [dimensions, speed, autoFill]);

  const style = React.useMemo<React.CSSProperties>(
    () => ({
      "--marquee-duration": `${duration}s`,
      "--marquee-gap": gap,
      "--marquee-delay": `${delay}s`,
      "--marquee-loop-count":
        loopCount === 0 || loopCount === Infinity
          ? "infinite"
          : loopCount.toString(),
      ...styleProp,
    }),
    [duration, gap, delay, loopCount, styleProp],
  );

  const contextValue = React.useMemo<MarqueeContextValue>(
    () => ({
      side,
      orientation,
      dir,
      speed,
      loopCount,
      contentRef,
      rootRef,
      autoFill,
      paused,
      pauseOnHover,
      pauseOnKeyboard,
      reverse,
    }),
    [
      side,
      orientation,
      dir,
      speed,
      loopCount,
      autoFill,
      paused,
      pauseOnHover,
      pauseOnKeyboard,
      reverse,
    ],
  );

  const MarqueePrimitive = asChild ? SlotPrimitive.Slot : "div";

  return (
    <MarqueeContext.Provider value={contextValue}>
      <div data-slot="marquee-wrapper" className="grid">
        <MarqueePrimitive
          role="marquee"
          aria-live="off"
          data-orientation={orientation}
          data-slot="marquee"
          dir={dir}
          tabIndex={pauseOnKeyboard ? 0 : undefined}
          {...marqueeProps}
          ref={composedRef}
          className={cn(
            "relative flex overflow-hidden motion-reduce:animate-none",
            orientation === "vertical" && "h-full flex-col",
            orientation === "horizontal" && "w-full",
            paused && "[&_*]:[animation-play-state:paused]",
            pauseOnHover && "group",
            pauseOnKeyboard &&
              "rounded-md focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
            className,
          )}
          style={style}
          onKeyDown={pauseOnKeyboard ? onKeyDown : undefined}
        />
      </div>
    </MarqueeContext.Provider>
  );
}

const marqueeContentVariants = cva(
  "flex min-w-full shrink-0 gap-(--marquee-gap)",
  {
    variants: {
      side: {
        left: "animate-marquee-left",
        right: "animate-marquee-right",
        top: "min-h-full min-w-auto animate-marquee-up flex-col",
        bottom: "min-h-full min-w-auto animate-marquee-down flex-col",
      },
      dir: {
        ltr: "",
        rtl: "",
      },
      pauseOnHover: {
        true: "group-hover:[animation-play-state:paused]",
        false: "",
      },
      reverse: {
        true: "[animation-direction:reverse]",
        false: "",
      },
    },
    compoundVariants: [
      {
        side: "left",
        dir: "rtl",
        className: "animate-marquee-left-rtl",
      },
      {
        side: "right",
        dir: "rtl",
        className: "animate-marquee-right-rtl",
      },
    ],
    defaultVariants: {
      side: "left",
      dir: "ltr",
      pauseOnHover: false,
      reverse: false,
    },
  },
);

function MarqueeContent(props: DivProps) {
  const {
    className,
    asChild,
    ref,
    children,
    style: styleProp,
    ...contentProps
  } = props;

  const context = useMarqueeContext(CONTENT_NAME);
  const composedRef = useComposedRefs(ref, context.contentRef);

  const isVertical = context.orientation === "vertical";
  const isRtl = context.dir === "rtl";

  const dimensions = useResizeObserverStore(
    context.rootRef,
    context.contentRef,
    context.orientation,
  );

  React.useEffect(() => {
    if (context.rootRef.current && context.contentRef.current) {
      resizeObserverStore.observe(
        context.rootRef.current,
        context.contentRef.current,
      );

      return () => {
        resizeObserverStore.unobserve(
          context.rootRef.current,
          context.contentRef.current,
        );
      };
    }
  }, [context.rootRef, context.contentRef]);

  const multiplier = React.useMemo(() => {
    if (!context.autoFill || !dimensions) return 1;

    const { rootSize, contentSize } = dimensions;
    if (contentSize === 0) return 1;

    return contentSize < rootSize ? Math.ceil(rootSize / contentSize) : 1;
  }, [context.autoFill, dimensions]);

  const onMultipliedChildrenRender = React.useCallback(
    (count: number) => {
      return Array.from({ length: Math.max(0, count) }).map((_, i) => (
        <React.Fragment key={i}>{children}</React.Fragment>
      ));
    },
    [children],
  );

  const style = React.useMemo(
    () => ({
      ...styleProp,
      animationDuration: "var(--marquee-duration)",
      animationDelay: "var(--marquee-delay)",
      animationIterationCount: "var(--marquee-loop-count)",
      animationDirection: context.reverse ? "reverse" : "normal",
    }),
    [styleProp, context.reverse],
  );

  const ContentPrimitive = asChild ? SlotPrimitive.Slot : "div";

  return (
    <>
      <ContentPrimitive
        data-orientation={context.orientation}
        data-slot="marquee-content"
        {...contentProps}
        style={style}
        className={cn(
          marqueeContentVariants({
            side: context.side,
            dir: context.dir,
            pauseOnHover: context.pauseOnHover,
            reverse: context.reverse,
            className,
          }),
          isVertical && "flex-col",
          isVertical
            ? "mb-(--marquee-gap)"
            : isRtl
              ? "ml-(--marquee-gap)"
              : "mr-(--marquee-gap)",
        )}
      >
        <div
          ref={composedRef}
          className={cn(
            "flex shrink-0 gap-(--marquee-gap)",
            isVertical && "flex-col",
          )}
        >
          {children}
        </div>
        {onMultipliedChildrenRender(multiplier - 1)}
      </ContentPrimitive>
      <ContentPrimitive
        role="presentation"
        aria-hidden="true"
        {...contentProps}
        style={style}
        className={cn(
          marqueeContentVariants({
            side: context.side,
            dir: context.dir,
            pauseOnHover: context.pauseOnHover,
            reverse: context.reverse,
            className,
          }),
          isVertical && "flex-col",
        )}
      >
        {onMultipliedChildrenRender(multiplier)}
      </ContentPrimitive>
    </>
  );
}

function MarqueeItem(props: DivProps) {
  const { className, asChild, ...itemProps } = props;

  const ItemPrimitive = asChild ? SlotPrimitive.Slot : "div";

  return (
    <ItemPrimitive
      data-slot="marquee-item"
      {...itemProps}
      className={cn("shrink-0", className)}
    />
  );
}

const marqueeEdgeVariants = cva("pointer-events-none absolute z-10", {
  variants: {
    side: {
      left: "top-0 left-0 h-full bg-gradient-to-r from-background to-transparent",
      right:
        "top-0 right-0 h-full bg-gradient-to-l from-background to-transparent",
      top: "top-0 left-0 w-full bg-gradient-to-b from-background to-transparent",
      bottom:
        "bottom-0 left-0 w-full bg-gradient-to-t from-background to-transparent",
    },
    size: {
      default: "",
      sm: "",
      lg: "",
    },
  },
  compoundVariants: [
    {
      side: ["left", "right"],
      size: "default",
      className: "w-1/4",
    },
    {
      side: ["left", "right"],
      size: "sm",
      className: "w-1/6",
    },
    {
      side: ["left", "right"],
      size: "lg",
      className: "w-1/3",
    },
    {
      side: ["top", "bottom"],
      size: "default",
      className: "h-1/4",
    },
    {
      side: ["top", "bottom"],
      size: "sm",
      className: "h-1/6",
    },
    {
      side: ["top", "bottom"],
      size: "lg",
      className: "h-1/3",
    },
  ],
  defaultVariants: {
    size: "default",
  },
});

interface MarqueeEdgeProps
  extends VariantProps<typeof marqueeEdgeVariants>,
    DivProps {}

function MarqueeEdge(props: MarqueeEdgeProps) {
  const { side, size, className, asChild, ...edgeProps } = props;

  const EdgePrimitive = asChild ? SlotPrimitive.Slot : "div";

  return (
    <EdgePrimitive
      data-size={size}
      data-slot="marquee-edge"
      {...edgeProps}
      className={cn(marqueeEdgeVariants({ side, size, className }))}
    />
  );
}

export {
  Marquee,
  MarqueeContent,
  MarqueeItem,
  MarqueeEdge,
  //
  type MarqueeProps,
};
