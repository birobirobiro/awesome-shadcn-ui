import { PageSkeleton } from "@/components/layout/page-skeleton";

export default function CategoriesLoading() {
  return <PageSkeleton variant="cards" rows={8} />;
}
