import { ItemPageContent } from "@/components/item-page-content";
import { fetchAndParseReadme } from "@/hooks/use-readme";
import { categoryNameToSlug, slugToCategoryName } from "@/lib/slugs";
import { notFound } from "next/navigation";

interface ItemPageProps {
  params: Promise<{
    category: string;
    id: string;
  }>;
}

// Item pages depend only on the README, so they are prerendered at build time
// for every category and item id and served statically afterwards.
export const dynamic = "force-static";

export async function generateStaticParams() {
  const resources = await fetchAndParseReadme();

  return resources.map((resource) => ({
    category: categoryNameToSlug(resource.category),
    id: resource.id,
  }));
}

export default async function ItemPage({ params }: ItemPageProps) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.category;
  const categoryName = slugToCategoryName(categorySlug);
  const itemId = resolvedParams.id;

  // Fetch data server-side - no loading state flash
  const resources = await fetchAndParseReadme();
  const item = resources.find((resource) => resource.id === itemId);

  if (!item) {
    notFound();
  }

  const relatedItems = resources
    .filter(
      (resource) =>
        resource.category === item.category && resource.id !== item.id,
    )
    .slice(0, 6);

  return (
    <ItemPageContent
      item={item}
      relatedItems={relatedItems}
      categorySlug={categorySlug}
      categoryName={categoryName}
    />
  );
}
