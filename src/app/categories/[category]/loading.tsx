import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
  return (
    <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-8">
      {/* PageHeader skeleton */}
      <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-2" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-2" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Title and description */}
        <div className="space-y-3 sm:space-y-4">
          <Skeleton className="h-8 sm:h-10 md:h-12 w-48 sm:w-72" />
          <Skeleton className="h-5 sm:h-6 w-full max-w-lg" />

          {/* Actions - item count and search */}
          <div className="space-y-3 sm:space-y-4 w-full">
            <div className="flex items-center gap-2 sm:gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="hidden sm:block h-4 w-2" />
              <Skeleton className="hidden sm:block h-4 w-16" />
            </div>
            <Skeleton className="h-10 w-full max-w-md" />
          </div>
        </div>
      </div>

      {/* ItemGrid skeleton - matches ItemCard structure */}
      <div className="min-h-screen mb-6 sm:mb-8">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="border p-4 space-y-0 flex flex-col h-full">
              {/* CardHeader */}
              <div className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-4" />
                </div>
                <Skeleton className="h-5 w-3/4" />
              </div>

              <div className="h-px bg-border" />

              {/* CardContent */}
              <div className="py-3 flex-1 space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
                <Skeleton className="h-3 w-28" />
              </div>

              <div className="h-px bg-border" />

              {/* CardFooter */}
              <div className="pt-3 flex gap-3">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      {/* Showing text */}
      <div className="flex justify-center mt-4 sm:mt-6">
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );
}
