import { CategoryPageContent } from "@/components/category-page-content";
import { fetchAndParseReadme } from "@/hooks/use-readme";
import { slugToCategoryName } from "@/lib/slugs";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.category;
  const categoryName = slugToCategoryName(categorySlug);

  const resources = await fetchAndParseReadme();
  const categoryItems = resources.filter(
    (item) => item.category === categoryName,
  );

  if (categoryItems.length === 0) {
    notFound();
  }

  return (
    <CategoryPageContent
      items={categoryItems}
      categoryName={categoryName}
      categorySlug={categorySlug}
    />
  );
}
