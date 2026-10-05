/**
 * Utility functions for converting between category names and URL-friendly slugs
 */

export function categoryNameToSlug(categoryName: string): string {
  return categoryName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}

export function slugToCategoryName(slug: string): string {
  // This is a reverse mapping - we need to find the original category name
  // Since we can't perfectly reverse the slug, we'll need to maintain a mapping
  const slugToCategoryMap: Record<string, string> = {
    "libs-and-components": "Libs and Components",
    registries: "Registries",
    "plugins-and-extensions": "Plugins and Extensions",
    "colors-and-customizations": "Colors and Customizations",
    animations: "Animations",
    tools: "Tools",
    "websites-and-portfolios": "Websites and Portfolios",
    platforms: "Platforms",
    ports: "Ports",
    "design-system": "Design System",
    "boilerplates-templates": "Boilerplates / Templates",
  };

  return slugToCategoryMap[slug] || slug;
}

export function createCategorySlugMap(
  categories: string[],
): Record<string, string> {
  const map: Record<string, string> = {};
  categories.forEach((category) => {
    map[category] = categoryNameToSlug(category);
  });
  return map;
}

export function createSlugToCategoryMap(
  categories: string[],
): Record<string, string> {
  const map: Record<string, string> = {};
  categories.forEach((category) => {
    map[categoryNameToSlug(category)] = category;
  });
  return map;
}

export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}

export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
