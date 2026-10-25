"use client";

import { CategoryIcon } from "@/components/category-icon";

import { useState } from "react";
import Sort, { SortOption } from "@/components/sort";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface SearchFilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryOptions: { label: string; value: string; count: number }[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  sortOption: SortOption;
  onValueChange: (option: SortOption) => void;
  totalItems: number;
  resultCount: number;
  onClearFilters: () => void;
}

const VISIBLE_CATEGORIES = 5;

export function SearchFilterControls({
  searchQuery,
  setSearchQuery,
  categoryOptions,
  selectedCategories,
  setSelectedCategories,
  sortOption,
  onValueChange,
  totalItems,
  resultCount,
  onClearFilters,
}: SearchFilterControlsProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const visibleCategories = categoryOptions.filter(
    (category, index) =>
      showAllCategories ||
      index < VISIBLE_CATEGORIES ||
      selectedCategories.includes(category.value),
  );
  const hasFilters = Boolean(searchQuery || selectedCategories.length);

  return (
    <div className="catalog-filters">
      <div className="catalog-toolbar">
        <InputGroup className="catalog-search">
          <InputGroupInput
            id="catalog-search"
            name="q"
            type="search"
            autoComplete="off"
            placeholder="Search resources…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search resources"
          />
          <InputGroupAddon>
            <Search aria-hidden="true" />
          </InputGroupAddon>
          {searchQuery && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                aria-label="Clear search"
                onClick={() => setSearchQuery("")}
              >
                <X aria-hidden="true" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
        <div className="catalog-toolbar__actions">
          <span className="catalog-sort-label" id="catalog-sort-label">
            Sort by
          </span>
          <Sort sortOption={sortOption} onValueChange={onValueChange} />
        </div>
      </div>

      <div className="catalog-category-heading">
        <span>Categories</span>
        <span className="text-muted-foreground">Select one or more</span>
      </div>
      <div
        className="category-rail"
        role="group"
        aria-label="Filter by category"
      >
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="category-chip"
          aria-pressed={selectedCategories.length === 0}
          onClick={() => setSelectedCategories([])}
        >
          <CategoryIcon category="All" />
          All <span className="category-chip__count">{totalItems}</span>
        </Button>
        <ToggleGroup
          type="multiple"
          value={selectedCategories}
          onValueChange={setSelectedCategories}
          className="contents"
          spacing={1.5}
          aria-label="Categories"
          id="catalog-categories"
        >
          {visibleCategories.map((category) => (
            <ToggleGroupItem
              key={category.value}
              value={category.value}
              className="category-chip"
              disabled={
                category.count === 0 &&
                !selectedCategories.includes(category.value)
              }
            >
              {selectedCategories.includes(category.value) ? (
                <Check aria-hidden="true" />
              ) : (
                <CategoryIcon category={category.value} />
              )}
              {category.label}
              <span className="category-chip__count">{category.count}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {categoryOptions.length > VISIBLE_CATEGORIES && (
          <Button
            variant="ghost"
            size="sm"
            type="button"
            className="category-rail__expand"
            aria-expanded={showAllCategories}
            aria-controls="catalog-categories"
            onClick={() => setShowAllCategories((value) => !value)}
          >
            {showAllCategories ? "Show fewer" : "All categories"}
            <ChevronDown
              data-icon="inline-end"
              aria-hidden="true"
              className={showAllCategories ? "rotate-180" : undefined}
            />
          </Button>
        )}
      </div>

      <div className="catalog-filter-summary">
        <p role="status" aria-live="polite" aria-atomic="true">
          <strong>{resultCount}</strong>{" "}
          {resultCount === 1 ? "resource" : "resources"}
          {hasFilters ? " found" : " available"}
          {selectedCategories.length > 0 && (
            <span className="catalog-filter-summary__detail">
              {" · "}
              {selectedCategories.length}{" "}
              {selectedCategories.length === 1 ? "category" : "categories"}{" "}
              selected
            </span>
          )}
        </p>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onClearFilters}
          >
            <X data-icon="inline-start" aria-hidden="true" /> Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
