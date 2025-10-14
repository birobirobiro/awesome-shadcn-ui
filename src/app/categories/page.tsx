"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAndParseReadme, Resource } from "@/hooks/use-readme";
import { categoryNameToSlug } from "@/lib/slugs";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Category {
  title: string;
  items: Resource[];
  description: string;
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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
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

        const formattedCategories = Object.entries(groupedCategories).map(
          ([title, items]) => ({
            title,
            items,
            description:
              CATEGORY_DESCRIPTIONS[title] ||
              "A collection of shadcn/ui related resources",
          }),
        );

        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <Skeleton className="h-8 sm:h-12 w-full max-w-96 mx-auto" />
            <Skeleton className="h-4 sm:h-6 w-full max-w-64 mx-auto" />
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(9)].map((_, i) => (
              <Card key={i} className="h-full">
                <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                  <div className="flex items-center justify-between gap-2">
                    <Skeleton className="h-5 sm:h-6 w-3/4" />
                    <Skeleton className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <Skeleton className="h-3 sm:h-4 w-full mt-2" />
                  <Skeleton className="h-3 sm:h-4 w-5/6" />
                </CardHeader>
                <CardContent className="pt-0 p-4 sm:p-6">
                  <div className="flex items-center justify-between gap-2">
                    <Skeleton className="h-5 sm:h-6 w-16" />
                    <div className="flex items-center space-x-1">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-3 w-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader
        title="Categories"
        description="Explore our curated collection of shadcn/ui resources organized by category"
        breadcrumbs={[{ label: "Categories", href: "/categories" }]}
      />

      <div className="min-h-screen grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div key={category.title}>
            <Link href={`/categories/${categoryNameToSlug(category.title)}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer relative overflow-hidden hover:border-primary/20">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent dark:from-primary/10" />
                </div>
                <div className="relative z-10 flex flex-col h-full">
                  <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                    <div className="flex items-start sm:items-center justify-between gap-2">
                      <CardTitle className="text-lg sm:text-xl group-hover:text-primary transition-colors leading-tight break-words flex-1 min-w-0">
                        {category.title}
                      </CardTitle>
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                    <CardDescription className="text-xs sm:text-sm leading-relaxed break-words">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 p-4 sm:p-6">
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        variant="secondary"
                        className="text-xs flex-shrink-0"
                      >
                        {category.items.length}{" "}
                        {category.items.length === 1 ? "item" : "items"}
                      </Badge>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
