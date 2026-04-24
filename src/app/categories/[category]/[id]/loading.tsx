import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-8">
      {/* PageHeader skeleton */}
      <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 flex-wrap">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-2" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-2" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-2" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Title with icon and description */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3">
            <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
            <Skeleton className="h-8 sm:h-10 md:h-12 w-48 sm:w-72 lg:w-96" />
          </div>
          <Skeleton className="h-5 sm:h-6 w-full max-w-2xl" />

          {/* Actions - date and category */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 sm:h-4 sm:w-4" />
              <Skeleton className="h-4 w-32 sm:w-40" />
            </div>
            <Skeleton className="hidden sm:block h-4 w-2" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 sm:h-4 sm:w-4" />
              <Skeleton className="h-4 w-24 sm:w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Left column - Preview */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <Card>
            <CardHeader className="p-4 pb-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 sm:h-5 sm:w-5" />
                <Skeleton className="h-5 w-16 sm:h-6" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="relative h-[300px] sm:h-[500px] lg:h-[600px] overflow-hidden border bg-muted/50 flex items-center justify-center">
                <div className="text-center">
                  <Globe className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Category and Related */}
        <div className="space-y-4 sm:space-y-6">
          {/* Category Card */}
          <Card>
            <CardHeader className="p-4">
              <Skeleton className="h-5 w-20 sm:h-6" />
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <Skeleton className="h-6 w-28" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Related Items Card */}
          <Card>
            <CardHeader className="p-4">
              <Skeleton className="h-5 w-28 sm:h-6" />
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-3 border space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
