import { CategoryPageContent } from "@/components/category-page-content";
import { fetchAndParseReadme } from "@/hooks/use-readme";
import { PR_TEMPLATE } from "@/lib/config";
import { categoryNameToSlug, slugToCategoryName } from "@/lib/slugs";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

// Category pages depend only on the README, so they are prerendered at build
// time for every known category slug and served statically afterwards.
export const dynamic = "force-static";

export function generateStaticParams() {
  return PR_TEMPLATE.CATEGORIES.map((category) => ({
    category: categoryNameToSlug(category),
  }));
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
