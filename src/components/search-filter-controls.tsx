import Sort, { SortOption } from "@/components/sort";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { motion } from "motion/react";
import type React from "react";
import { useCallback } from "react";

interface SearchFilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryOptions: { label: string; value: string }[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

export function SearchFilterControls({
  searchQuery,
  setSearchQuery,
  categoryOptions,
  selectedCategories,
  setSelectedCategories,
  sortOption,
  onSortChange,
}: SearchFilterControlsProps) {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [setSearchQuery],
  );

  return (
    <motion.div
      className="flex flex-col sm:flex-row justify-between items-center gap-4"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delay: 0.2,
          },
        },
      }}
    >
      <Input
        type="text"
        placeholder="Search items..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full sm:w-[200px]"
      />
      <div className="w-full sm:w-auto flex flex-row items-center gap-4">
        <MultiSelect
          options={categoryOptions}
          value={selectedCategories}
          onValueChange={setSelectedCategories}
          placeholder="Filter by category"
          className=" w-[160px] sm:w-[200px]"
        />
        <Sort sortOption={sortOption} onSortChange={onSortChange} />
      </div>
    </motion.div>
  );
}
