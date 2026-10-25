import React from "react";
import { SearchX } from "lucide-react";

import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { Resource } from "@/hooks/use-readme";
import ItemCard from "./item-card";
import SponsorCard from "./sponsor-card";
import { sponsors } from "@/components/sponsors/sponsors";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const SPONSOR_INTERVAL = 8;

interface ItemGridProps {
  items: Resource[];
  bookmarkedItems: string[];
  onBookmark: (id: string) => void;
  isBookmarkLoading?: boolean;
  startIndex?: number;
  pageSize?: number;
}

export function ItemGrid({
  items,
  bookmarkedItems,
  onBookmark,
  isBookmarkLoading = false,
  startIndex = 0,
  pageSize = 0,
}: ItemGridProps) {
  if (items.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No items found matching your criteria.</EmptyTitle>
          <EmptyDescription>
            Try adjusting your search or filter settings.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const gridItems: React.ReactNode[] = [];

  items.forEach((item, index) => {
    gridItems.push(
      <ItemCard
        key={`item-${item.id}`}
        id={item.id}
        title={item.name}
        description={item.description}
        url={item.url}
        category={item.category}
        date={item.date}
        stars={item.stars}
        isBookmarked={bookmarkedItems.includes(item.id)}
        onBookmark={onBookmark}
        isBookmarkLoading={isBookmarkLoading}
        index={startIndex + index}
      />,
    );

    if (index % SPONSOR_INTERVAL === 0 && sponsors.length > 0) {
      const sponsor =
        sponsors[Math.floor(index / SPONSOR_INTERVAL) % sponsors.length];
      gridItems.push(
        <SponsorCard key={`sponsor-${startIndex + index}`} sponsor={sponsor} />,
      );
    }
  });

  const emptyRows = Math.max(0, pageSize - gridItems.length);

  return (
    <Table className="resource-table">
      <TableCaption className="sr-only">Resources and sponsors</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="resource-table__index" scope="col">
            <span className="sr-only">Number</span>
          </TableHead>
          <TableHead scope="col">Resource</TableHead>
          <TableHead className="resource-table__category" scope="col">
            Category
          </TableHead>
          <TableHead className="resource-table__added" scope="col">
            Added
          </TableHead>
          <TableHead className="resource-table__stars" scope="col">
            Stars
          </TableHead>
          <TableHead className="resource-table__actions" scope="col">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gridItems}
        {Array.from({ length: emptyRows }, (_, index) => (
          <TableRow
            key={`empty-${index}`}
            className="resource-row resource-row--empty"
            aria-hidden="true"
          >
            <TableCell className="resource-row__index" />
            <TableCell className="resource-row__main" />
            <TableCell className="resource-row__category" />
            <TableCell className="resource-row__added" />
            <TableCell className="resource-row__stars" />
            <TableCell className="resource-row__actions" />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
