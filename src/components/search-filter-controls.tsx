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
      className="flex flex-col gap-3 w-full sm:flex-row sm:items-center sm:justify-between sm:gap-4"
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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
        <Input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full sm:w-[200px]"
        />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <MultiSelect
            options={categoryOptions}
            value={selectedCategories}
            onValueChange={setSelectedCategories}
            placeholder="Filter by category"
            className="flex-1 sm:flex-none sm:w-[200px]"
          />
          <Sort
            sortOption={sortOption}
            onSortChange={onSortChange}
            className="flex-1 sm:flex-none"
          />
        </div>
      </div>
      <PRSubmissionDialog
        trigger={
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto h-9 whitespace-nowrap"
          >
            <Github className="mr-1.5 h-3.5 w-3.5" />
            Submit new resource
          </Button>
        }
      />
    </motion.div>
  );
}
