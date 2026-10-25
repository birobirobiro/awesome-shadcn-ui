import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  handlePageChange: (pageNumber: number) => void;
  handleItemsPerPageChange: (value: string) => void;
  itemsPerPageOptions: number[];
}

function getPageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages] as const;
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const;
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ] as const;
}

export function PaginationControls({
  currentPage,
  totalPages,
  itemsPerPage,
  handlePageChange,
  handleItemsPerPageChange,
  itemsPerPageOptions,
}: PaginationControlsProps) {
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="pagination">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Items per page</span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={handleItemsPerPageChange}
        >
          <SelectTrigger className="h-9 w-[4.5rem]" aria-label="Items per page">
            <SelectValue placeholder={itemsPerPage} />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              {itemsPerPageOptions.map((number) => (
                <SelectItem key={number} value={number.toString()}>
                  {number}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <span className="sr-only" aria-live="polite">
        Page {currentPage} of {totalPages}
      </span>
      <Pagination className="mx-0 w-auto" aria-label="Resource pages">
        <PaginationContent className="pagination__pages">
          <PaginationItem>
            <Button
              variant="ghost"
              size="icon-sm"
              className="page-button"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              aria-label="First page"
            >
              <ChevronsLeft aria-hidden="true" />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="ghost"
              size="icon-sm"
              className="page-button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft aria-hidden="true" />
            </Button>
          </PaginationItem>
          {pages.map((page, index) => (
            <PaginationItem
              key={page === "ellipsis" ? `ellipsis-${index}` : page}
            >
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <Button
                  variant={page === currentPage ? "outline" : "ghost"}
                  size="icon-sm"
                  className="page-button"
                  onClick={() => handlePageChange(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  aria-label={`Page ${page}`}
                >
                  {page}
                </Button>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <Button
              variant="ghost"
              size="icon-sm"
              className="page-button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight aria-hidden="true" />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="ghost"
              size="icon-sm"
              className="page-button"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="Last page"
            >
              <ChevronsRight aria-hidden="true" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
