import { CategoryIcon } from "@/components/category-icon";
import { PageHeader } from "@/components/layout/page-header";
import { fetchAndParseReadme, Resource } from "@/hooks/use-readme";
import { categoryNameToSlug } from "@/lib/slugs";
import Link from "next/link";

interface Category {
  title: string;
  items: Resource[];
  description: string;
}

// The categories index depends only on the README, so it is prerendered at
// build time and cached until the next deploy.
export const dynamic = "force-static";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Libs and Components":
    "Essential libraries and reusable components built with shadcn/ui",
  Registries: "Component registries and collections for shadcn/ui",
  "Plugins and Extensions":
    "Tools and extensions that enhance your shadcn/ui workflow",
  "Colors and Customizations":
    "Themes, color palettes, and customization utilities",
  Animations: "Animation libraries and motion components for shadcn/ui",
  Tools: "Development tools, generators, and utilities for shadcn/ui projects",
  "Websites and Portfolios":
    "Real-world examples and inspiration for your projects",
  Platforms: "Platforms and services that integrate with shadcn/ui",
  Ports: "Ports of shadcn/ui to other frameworks and technologies",
  "Design System": "Complete design systems and component libraries",
  "Boilerplates / Templates":
    "Starter templates and boilerplates for quick project setup",
};

export default async function CategoriesPage() {
  const fetchedResources = await fetchAndParseReadme();

  const EXCLUDED_CATEGORIES = ["Star History", "Contributors"];

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
      description:
        CATEGORY_DESCRIPTIONS[title] ||
        "A collection of shadcn/ui related resources",
    }),
  );

  const totalItems = categories.reduce(
    (sum, category) => sum + category.items.length,
    0,
  );

  return (
    <div className="shell">
      <PageHeader
        title="Categories"
        description="Explore the index by category. Every category is built from the same README, so the list stays current with the repository."
        breadcrumbs={[{ label: "Categories", href: "/categories" }]}
      />

      <div className="category-index">
        {categories.map((category) => (
          <Link
            prefetch={false}
            key={category.title}
            href={`/categories/${categoryNameToSlug(category.title)}`}
            className="category-card"
          >
            <div className="category-card__top">
              <h2 className="category-card__title">
                <CategoryIcon category={category.title} />
                <span>{category.title}</span>
              </h2>
              <span className="category-card__count">
                {category.items.length}{" "}
                {category.items.length === 1 ? "resource" : "resources"}
              </span>
            </div>

            <p className="category-card__description">{category.description}</p>

            <p className="category-card__preview">
              {category.items
                .slice(0, 3)
                .map((item) => item.name)
                .join(" · ")}
            </p>
          </Link>
        ))}

        <Link
          prefetch={false}
          href="/#index"
          className="category-card category-card--all"
        >
          <div className="category-card__top">
            <h2 className="category-card__title">
              <CategoryIcon category="All resources" />
              <span>All resources</span>
            </h2>
            <span className="category-card__count">{totalItems} resources</span>
          </div>

          <p className="category-card__description">
            Browse the full index across every category.
          </p>

          <p className="category-card__preview">
            <span className="text-foreground">Complete:</span> all {totalItems}{" "}
            resources in one index
          </p>
        </Link>
      </div>
    </div>
  );
}
