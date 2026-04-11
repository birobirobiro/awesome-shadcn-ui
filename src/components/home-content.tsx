"use client";

import { SubmitCTA } from "@/components/cta-submit";
import Hero from "@/components/hero";
import ItemList from "@/components/items-list";
import { type Resource } from "@/hooks/use-readme";
import { motion } from "motion/react";

interface Category {
  title: string;
  items: Resource[];
}

interface HomeContentProps {
  categories: Category[];
  items: Resource[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

export function HomeContent({ categories, items }: HomeContentProps) {
  return (
    <motion.div
      className="container mx-auto max-w-7xl px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Hero />

      <motion.div className="mt-12 mb-8" variants={itemVariants}>
        <ItemList items={items} categories={categories} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <SubmitCTA />
      </motion.div>
    </motion.div>
  );
}
