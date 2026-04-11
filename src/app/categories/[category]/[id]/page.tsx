import { ItemPageContent } from "@/components/item-page-content";
import { fetchAndParseReadme } from "@/hooks/use-readme";
import { slugToCategoryName } from "@/lib/slugs";
import { notFound } from "next/navigation";

interface ItemPageProps {
  params: Promise<{
    category: string;
    id: string;
  }>;
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
