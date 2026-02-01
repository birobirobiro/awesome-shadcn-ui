"use client";

import { SubmitCTA } from "@/components/sections/cta-submit";
import Hero from "@/components/sections/hero";
import ItemList from "@/components/sections/items-list";
import { Sponsorship } from "@/components/sections/sponsorship";
import { Resource, fetchAndParseReadme } from "@/hooks/use-readme";
import { isValid, parseISO } from "date-fns";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface Category {
  title: string;
  items: Resource[];
}

const EXCLUDED_CATEGORIES = ["Star History", "Contributors"];

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredItems, setFilteredItems] = useState<Resource[]>([]);

  useEffect(() => {
    async function fetchData() {
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
    }

    fetchData();
  }, []);

  return (
    <motion.div
      className="container mx-auto max-w-7xl px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Hero />

      <motion.div
        className="mt-12 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <ItemList
          key={filteredItems.length}
          items={filteredItems}
          categories={categories}
        />
      </motion.div>

      <Sponsorship />

      <SubmitCTA />
    </motion.div>
  );
}
