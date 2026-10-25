import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type SortOption =
  | "date-desc"
  | "date-asc"
  | "name-asc"
  | "name-desc"
  | "stars-desc";

interface SortProps {
  sortOption: SortOption;
  onValueChange: (option: SortOption) => void;
  className?: string;
}

const sortOptions = [
  { value: "date-desc", label: "Newest first" },
  { value: "date-asc", label: "Oldest first" },
  { value: "name-asc", label: "Name A to Z" },
  { value: "name-desc", label: "Name Z to A" },
  { value: "stars-desc", label: "Most stars" },
] as const;

export default function Sort({
  sortOption,
  onValueChange,
  className,
}: SortProps) {
  return (
    <Select value={sortOption} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn("w-full sm:w-[12.5rem]", className)}
        aria-label="Sort resources"
      >
        <SelectValue placeholder="Sort resources" />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectGroup>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
