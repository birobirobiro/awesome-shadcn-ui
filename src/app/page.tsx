import { HomeContent } from "@/components/home-content";
import { fetchAndParseReadme, type Resource } from "@/hooks/use-readme";
import { isValid, parseISO } from "date-fns";

interface Category {
  title: string;
  items: Resource[];
}

const EXCLUDED_CATEGORIES = ["Star History", "Contributors"];

export default async function Home() {
  const fetchedResources = await fetchAndParseReadme();

  const groupedCategories = fetchedResources.reduce(
    (acc, resource) => {
      if (!EXCLUDED_CATEGORIES.includes(resource.category)) {
        if (!acc[resource.category]) {
          acc[resource.category] = [];
        }
        acc[resource.category].push(resource);
      }
      return acc;
    },
    {} as Record<string, Resource[]>,
  );

  const categories: Category[] = Object.entries(groupedCategories).map(
    ([title, items]) => ({
      title,
      items,
    }),
  );

  const eligibleItems = fetchedResources.filter(
    (item) => !EXCLUDED_CATEGORIES.includes(item.category),
  );

  const sortedItems = eligibleItems.sort((a, b) => {
    const dateA =
      a.date && a.date !== "Unknown" ? parseISO(a.date) : new Date(0);
    const dateB =
      b.date && b.date !== "Unknown" ? parseISO(b.date) : new Date(0);

    if (!isValid(dateA)) return 1;
    if (!isValid(dateB)) return -1;

    return dateB.getTime() - dateA.getTime();
  });

  return <HomeContent categories={categories} items={sortedItems} />;
}
