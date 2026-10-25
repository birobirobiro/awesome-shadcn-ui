import { Skeleton } from "@/components/ui/skeleton";

interface PageSkeletonProps {
  variant?: "list" | "cards" | "item";
  rows?: number;
}

function HeaderSkeleton() {
  return (
    <div className="page-header">
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-2" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="mt-5">
        <Skeleton className="h-10 w-56" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
    </div>
  );
}

function ListSkeleton({ rows }: { rows: number }) {
  return (
    <div className="resource-list">
      {Array.from({ length: rows }).map((_, index) => (
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

function CardsSkeleton({ rows }: { rows: number }) {
  return (
    <div className="category-index">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="category-card">
          <div className="category-card__top">
            <Skeleton className="h-3 w-6" />
            <Skeleton className="h-6 w-2/3" />
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
          <div className="mt-5">
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ItemSkeleton() {
  return (
    <div className="item-layout">
      <div className="item-preview">
        <div className="item-preview__head">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="item-preview__body p-6">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-4 h-6 w-3/4" />
          <Skeleton className="mt-4 h-3 w-full" />
          <Skeleton className="mt-2 h-3 w-5/6" />
          <Skeleton className="mt-6 h-64 w-full" />
        </div>
      </div>

      <div className="item-sidebar">
        <div className="side-panel">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="mt-4 h-3 w-full" />
          <Skeleton className="mt-2 h-3 w-4/5" />
          <Skeleton className="mt-5 h-9 w-full" />
        </div>
        <div className="side-panel">
          <Skeleton className="h-3 w-28" />
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="mt-4">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="mt-2 h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton({
  variant = "list",
  rows = variant === "cards" ? 8 : 10,
}: PageSkeletonProps) {
  return (
    <div className="shell">
      <HeaderSkeleton />
      {variant === "cards" ? (
        <CardsSkeleton rows={rows} />
      ) : variant === "item" ? (
        <ItemSkeleton />
      ) : (
        <div className="catalog-results py-8">
          <ListSkeleton rows={rows} />
        </div>
      )}
    </div>
  );
}
