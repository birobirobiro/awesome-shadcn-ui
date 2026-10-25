import { PageSkeleton } from "@/components/layout/page-skeleton";

export default function CategoryLoading() {
  return <PageSkeleton variant="list" rows={10} />;
}
