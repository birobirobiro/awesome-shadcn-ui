import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesLoading() {
  return (
    <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-8">
      {/* PageHeader skeleton - left aligned */}
      <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-2" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Title and description */}
        <div className="space-y-3 sm:space-y-4">
          <Skeleton className="h-8 sm:h-10 md:h-12 w-48 sm:w-64" />
          <Skeleton className="h-5 sm:h-6 w-full max-w-xl" />
        </div>
      </div>

      {/* Grid */}
      <div className="min-h-screen grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(12)].map((_, i) => (
          <Card key={i} className="h-[280px] flex flex-col">
            <CardHeader className="p-4 pb-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-4" />
              </div>
              <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <div className="h-px bg-border mx-4" />
            <CardContent className="px-4 py-3 flex-1">
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </CardContent>
            <div className="h-px bg-border mx-4" />
            <CardFooter className="p-4 pt-3">
              <Skeleton className="h-5 w-16" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
