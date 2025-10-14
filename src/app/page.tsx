"use client";

import { SubmitCTA } from "@/components/sections/cta-submit";
import Hero from "@/components/sections/hero";
import ItemList from "@/components/sections/items-list";
import { Resource, fetchAndParseReadme } from "@/hooks/use-readme";
import { isValid, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Category {
  title: string;
  items: Resource[];
}

const EXCLUDED_CATEGORIES = ["Star History", "Contributors"];

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredItems, setFilteredItems] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

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

        const formattedCategories = Object.entries(groupedCategories).map(
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

        setCategories(formattedCategories);
        setFilteredItems(sortedItems);

        console.log(
          `Loaded ${sortedItems.length} items across ${formattedCategories.length} categories`,
        );
      } catch (error) {
        console.error("Error fetching README:", error);
        setError("Failed to load resources. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      className="container mx-auto max-w-7xl px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Hero />

      <motion.div variants={itemVariants} className="my-12">
        {error ? (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        ) : (
          <ItemList items={filteredItems} categories={categories} />
        )}
      </motion.div>

      <SubmitCTA />
    </motion.div>
  );
}
