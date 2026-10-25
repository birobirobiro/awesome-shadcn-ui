"use client";

import ItemList from "@/components/items-list";
import { type Resource } from "@/hooks/use-readme";

interface Category {
  title: string;
  items: Resource[];
}

interface HomeContentProps {
  categories: Category[];
  items: Resource[];
}

export function HomeContent({ categories, items }: HomeContentProps) {
  return <ItemList items={items} categories={categories} />;
}
