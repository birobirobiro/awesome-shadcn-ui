"use client";

import { PageHeader } from "@/components/layout/page-header";
import { WebsitePreview } from "@/components/website-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Resource } from "@/hooks/use-readme";
import { categoryNameToSlug } from "@/lib/slugs";
import { formatResourceDate } from "@/lib/utils";
import { Calendar, ExternalLink, Github, Globe, Tag } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

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

interface ItemPageContentProps {
  item: Resource;
  relatedItems: Resource[];
  categorySlug: string;
  categoryName: string;
}

export function ItemPageContent({
  item,
  relatedItems,
  categorySlug,
  categoryName,
}: ItemPageContentProps) {
  const [faviconUrl, setFaviconUrl] = useState<string>(() => {
    const domain = new URL(item.url).hostname;
    return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
  });

  const isGitHubUrl = (url: string) => {
    return url.includes("github.com");
  };

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
              className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0"
              onError={() => setFaviconUrl("")}
            />
          ) : (
            <div className="h-6 w-6 sm:h-8 sm:w-8 bg-muted flex items-center justify-center flex-shrink-0">
              <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </div>
          )
        }
        breadcrumbs={[
          { label: "Categories", href: "/categories" },
          { label: categoryName, href: `/categories/${categorySlug}` },
          {
            label: item.name,
            href: `/categories/${categorySlug}/${item.id}`,
          },
        ]}
        actions={
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="break-words">
                Added {formatResourceDate(item.date)}
              </span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <Tag className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="break-words">{item.category}</span>
            </div>
          </div>
        }
      />

      <div className="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-3">
        <motion.div
          className="lg:col-span-2 space-y-6 sm:space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="p-4 pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="relative h-[300px] sm:h-[500px] lg:h-[600px] overflow-hidden border group">
                <WebsitePreview url={item.url} name={item.name} />
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
                    <div className="relative overflow-hidden flex items-center justify-between p-3 border hover:bg-muted/50 hover:border-primary/20 transition-all duration-200 cursor-pointer group-hover:shadow-sm">
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
