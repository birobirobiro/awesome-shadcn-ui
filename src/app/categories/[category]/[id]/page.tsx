"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAndParseReadme, Resource } from "@/hooks/use-readme";
import { categoryNameToSlug, slugToCategoryName } from "@/lib/slugs";
import { format, isValid, parseISO } from "date-fns";
import { Calendar, ExternalLink, Github, Globe, Tag } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

interface ItemPageProps {
  params: Promise<{
    category: string;
    id: string;
  }>;
}

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
  "Websites and Portfolios Inspirations":
    "Real-world examples and inspiration for your projects",
  Platforms: "Platforms and services that integrate with shadcn/ui",
  Ports: "Ports of shadcn/ui to other frameworks and technologies",
  "Design System": "Complete design systems and component libraries",
  "Boilerplates / Templates":
    "Starter templates and boilerplates for quick project setup",
};

export default function ItemPage({ params }: ItemPageProps) {
  const resolvedParams = use(params);
  const [item, setItem] = useState<Resource | null>(null);
  const [relatedItems, setRelatedItems] = useState<Resource[]>([]);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const categorySlug = resolvedParams.category;
  const categoryName = slugToCategoryName(categorySlug);
  const itemId = resolvedParams.id;

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const fetchedResources = await fetchAndParseReadme();
        const foundItem = fetchedResources.find(
          (resource) => resource.id === itemId,
        );

        if (foundItem) {
          setItem(foundItem);

          const related = fetchedResources
            .filter(
              (resource) =>
                resource.category === foundItem.category &&
                resource.id !== foundItem.id,
            )
            .slice(0, 6);

          setRelatedItems(related);

          const domain = new URL(foundItem.url).hostname;
          setFaviconUrl(`https://icons.duckduckgo.com/ip3/${domain}.ico`);
        }
      } catch (error) {
        console.error("Error fetching item data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [itemId, categoryName]);

  const formatDate = (dateString: string) => {
    if (dateString === "Unknown") return "Unknown";
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "MMMM d, yyyy") : "Unknown";
  };

  const isGitHubUrl = (url: string) => {
    return url.includes("github.com");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <Skeleton className="h-8 sm:h-12 w-full max-w-96" />
            <Skeleton className="h-4 sm:h-6 w-full max-w-64" />
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 sm:h-4 sm:w-4" />
                <Skeleton className="h-3 w-16 sm:h-4 sm:w-20" />
              </div>
              <Skeleton className="h-3 w-2 sm:h-4" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 sm:h-4 sm:w-4" />
                <Skeleton className="h-3 w-12 sm:h-4 sm:w-16" />
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="p-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 sm:h-5 sm:w-5" />
                    <Skeleton className="h-5 w-16 sm:h-6 sm:w-16" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="h-96 sm:h-[44rem] w-full rounded-lg bg-muted/50 flex items-center justify-center">
                    <div className="text-center">
                      <Globe className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                      <Skeleton className="h-4 w-24 mx-auto" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="p-4">
                  <Skeleton className="h-5 w-16" />
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <Skeleton className="h-5 w-20" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full sm:h-4" />
                    <Skeleton className="h-3 w-3/4 sm:h-4" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4">
                  <Skeleton className="h-5 w-24 sm:h-6" />
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="p-3 rounded-lg border space-y-2">
                      <Skeleton className="h-3 w-3/4 sm:h-4" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <motion.div
      className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader
        title={item.name}
        description={item.description}
        icon={
          faviconUrl ? (
            <img
              src={faviconUrl}
              alt={`${item.name} favicon`}
              className="h-6 w-6 sm:h-8 sm:w-8 rounded-md flex-shrink-0"
              onError={() => setFaviconUrl(null)}
            />
          ) : (
            <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
              <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </div>
          )
        }
        breadcrumbs={[
          { label: "Categories", href: "/categories" },
          { label: categoryName, href: `/categories/${categorySlug}` },
          {
            label: item.name || "Loading...",
            href: `/categories/${categorySlug}/${itemId}`,
          },
        ]}
        actions={
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="break-words">Added {formatDate(item.date)}</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <Tag className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="break-words">{item.category}</span>
            </div>
          </div>
        }
      />

      <div className="min-h-screen grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-3">
        <motion.div
          className="lg:col-span-2 space-y-6 sm:space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="relative h-96 sm:h-[44rem] rounded-lg overflow-hidden border group">
                <iframe
                  src={item.url}
                  className="w-full h-full border-0 pointer-events-none"
                  title={`Preview of ${item.name}`}
                  sandbox="allow-scripts allow-same-origin"
                  loading="lazy"
                />
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-transparent cursor-pointer z-10"
                  title={`Visit ${item.name} - Opens in new tab`}
                  aria-label={`Visit ${item.name} website`}
                >
                  <span className="sr-only">Visit {item.name} website</span>
                </a>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/80 group-hover:via-black/40 group-hover:to-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-medium text-card-foreground">
                      Visit website
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="space-y-4 sm:space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base sm:text-lg">Category</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <Badge variant="secondary" className="text-xs sm:text-sm">
                {item.category}
              </Badge>
              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                {CATEGORY_DESCRIPTIONS[item.category] ||
                  "A collection of shadcn/ui related resources"}
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full text-xs sm:text-sm"
                >
                  <Link
                    href={`/categories/${categoryNameToSlug(item.category)}`}
                  >
                    View all in {item.category}
                  </Link>
                </Button>
                <Button asChild className="w-full text-xs sm:text-sm">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    {isGitHubUrl(item.url) ? (
                      <Github className="h-3 w-3 sm:h-4 sm:w-4" />
                    ) : (
                      <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                    {isGitHubUrl(item.url) ? "View on GitHub" : "Visit Website"}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {relatedItems.length > 0 && (
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base sm:text-lg">
                  Related Items
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                {relatedItems.map((relatedItem) => (
                  <Link
                    key={relatedItem.id}
                    href={`/categories/${categoryNameToSlug(item.category)}/${relatedItem.id}`}
                    className="block group"
                  >
                    <div className="relative overflow-hidden flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 hover:border-primary/20 transition-all duration-200 cursor-pointer group-hover:shadow-sm">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent dark:from-primary/10" />
                      </div>
                      <div className="relative z-10 flex items-center justify-between w-full">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium truncate group-hover:text-primary transition-colors">
                            {relatedItem.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate group-hover:text-muted-foreground/80 transition-colors">
                            {relatedItem.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                          <span className="text-xs text-muted-foreground hidden sm:inline">
                            View
                          </span>
                          <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
