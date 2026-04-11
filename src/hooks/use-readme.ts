import { GITHUB_CONFIG } from "@/lib/config";
import { titleToSlug } from "@/lib/slugs";
import { Octokit } from "@octokit/rest";

/** Singleton Octokit instance for GitHub API calls */
const octokit = new Octokit();

/** Categories to exclude from the resource list */
const EXCLUDED_CATEGORIES = ["Star History", "Contributors"];

/** Cache duration in milliseconds (30 minutes) */
const CACHE_DURATION = 30 * 60 * 1000;

/**
 * Represents a resource item from the awesome-shadcn-ui README.
 */
export interface Resource {
  /** Unique identifier derived from the resource name */
  id: string;
  /** Display name of the resource */
  name: string;
  /** URL to the resource */
  url: string;
  /** Brief description of the resource */
  description: string;
  /** Category the resource belongs to */
  category: string;
  /** Date the resource was added (or "Unknown") */
  date: string;
}

/** Cached resource data */
let cachedData: Resource[] | null = null;

/** Timestamp of when the cache was last updated */
let cacheTimestamp = 0;

/**
 * Parses a markdown table row into resource data.
 *
 * @param parts - Split parts of the table row
 * @param category - Current category being parsed
 * @returns Parsed resource data or null if invalid
 */
function parseTableRow(
  parts: string[],
  category: string,
): Omit<Resource, "id"> | null {
  const name = parts[1];
  let url = parts[3];
  let date = "Unknown";

  // Skip separator rows and header rows
  if (
    name === "Name" ||
    name.includes("---") ||
    name.trim() === "" ||
    parts[2] === "Description" ||
    parts[2].includes("---") ||
    url === "Link" ||
    url.includes("---")
  ) {
    return null;
  }

  // Extract URL from markdown link format [Link](url)
  const markdownMatch = url.match(/\[(.*?)\]\((.*?)\)/);
  if (markdownMatch?.[2]) {
    url = markdownMatch[2];
  } else {
    url = url.replace(/^Link:?\s*/i, "").trim();
  }

  // Check if there's a date column
  if (parts.length >= 5) {
    date = parts[4];
  }

  // Skip if URL is empty or invalid
  if (!url || url.trim() === "" || url === "Link") {
    return null;
  }

  return {
    name,
    description: parts[2],
    url,
    category,
    date,
  };
}

/**
 * Generates a unique ID for a resource, handling duplicates.
 *
 * @param baseName - The resource name to generate ID from
 * @param existingIds - Set of existing IDs to check against
 * @returns A unique ID string
 */
function generateUniqueId(baseName: string, existingIds: Set<string>): string {
  const baseSlug = titleToSlug(baseName);
  let uniqueId = baseSlug;
  let counter = 1;

  while (existingIds.has(uniqueId)) {
    uniqueId = `${baseSlug}-${counter}`;
    counter++;
  }

  existingIds.add(uniqueId);
  return uniqueId;
}

/**
 * Fetches and parses the awesome-shadcn-ui README to extract resources.
 *
 * Features:
 * - Caches results for 30 minutes to reduce API calls
 * - Parses markdown tables to extract resource data
 * - Generates unique IDs for each resource
 * - Filters out excluded categories and invalid entries
 *
 * @returns Promise resolving to array of Resource objects
 * @throws Error if fetching or parsing fails
 *
 * @example
 * ```tsx
 * // In a Server Component
 * const resources = await fetchAndParseReadme()
 *
 * // Filter by category
 * const tools = resources.filter(r => r.category === 'Tools')
 * ```
 */
export async function fetchAndParseReadme(): Promise<Resource[]> {
  // Return cached data if valid
  if (cachedData && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedData;
  }

  try {
    const response = await octokit.repos.getContent({
      owner: GITHUB_CONFIG.REPO_OWNER,
      repo: GITHUB_CONFIG.REPO_NAME,
      path: "README.md",
    });

    if (Array.isArray(response.data) || !("content" in response.data)) {
      throw new Error("Invalid response data");
    }

    const content = Buffer.from(response.data.content, "base64").toString();
    const lines = content.split("\n");

    const resources: Resource[] = [];
    const existingIds = new Set<string>();
    let currentCategory = "";

    for (const line of lines) {
      if (line.startsWith("## ")) {
        currentCategory = line.replace("## ", "").trim();
        continue;
      }

      if (!line.startsWith("| ") || !line.includes(" | ") || !currentCategory) {
        continue;
      }

      const parts = line.split("|").map((part) => part.trim());
      if (parts.length < 4) continue;

      const parsed = parseTableRow(parts, currentCategory);
      if (!parsed) continue;

      const id = generateUniqueId(parsed.name, existingIds);
      resources.push({ id, ...parsed });
    }

    // Filter out invalid entries and excluded categories
    const filteredResources = resources.filter(
      (resource) =>
        resource.name?.trim() &&
        resource.description?.trim() &&
        resource.url?.trim() &&
        !EXCLUDED_CATEGORIES.includes(resource.category),
    );

    // Update cache
    cachedData = filteredResources;
    cacheTimestamp = Date.now();

    return filteredResources;
  } catch (error) {
    console.error("Error fetching or parsing README:", error);
    throw error;
  }
}
