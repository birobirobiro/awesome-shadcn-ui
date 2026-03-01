import Sort, { SortOption } from "@/components/sort";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { Button } from "@/components/ui/button";
import { PRSubmissionDialog } from "@/components/pr-submission-dialog";
import { motion } from "motion/react";
import type React from "react";
import { useCallback } from "react";
import { Github } from "lucide-react";

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
      className="flex justify-between items-center gap-4 w-full"
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
      <div className="flex items-center gap-2 sm:gap-4">
        <Input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-[150px] sm:w-[200px]"
        />
        <MultiSelect
          options={categoryOptions}
          value={selectedCategories}
          onValueChange={setSelectedCategories}
          placeholder="Filter by category"
          className="w-[140px] sm:w-[200px]"
        />
        <Sort sortOption={sortOption} onSortChange={onSortChange} />
      </div>
      <PRSubmissionDialog
        trigger={
          <Button variant="outline" size="sm" className="h-9 whitespace-nowrap">
            <Github className="mr-1.5 h-3.5 w-3.5" />
            Submit new resource
          </Button>
        }
      />
    </motion.div>
  );
}
