import { ArrowUpRight, Bookmark, ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

import { categoryNameToSlug } from "@/lib/slugs";
import { formatResourceDate, formatStarCount } from "@/lib/utils";

interface ItemCardProps {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  date?: string;
  stars?: number;
  isBookmarked: boolean;
  onBookmark: (id: string) => void;
  isBookmarkLoading?: boolean;
  index?: number;
}

const ItemCard: React.FC<ItemCardProps> = ({
  id,
  title,
  description,
  url,
  category,
  date,
  stars,
  isBookmarked,
  onBookmark,
  isBookmarkLoading = false,
  index = 0,
}) => {
  const detailHref = `/categories/${categoryNameToSlug(category)}/${id}`;

  const addedDate = date ? formatResourceDate(date) : "Unknown";
  const starCount = stars !== undefined ? formatStarCount(stars) : "—";

  return (
    <TableRow className="resource-row">
      <TableCell className="resource-row__index">
        <Badge variant="outline" className="resource-row__number">
          {String(index + 1).padStart(2, "0")}
        </Badge>
      </TableCell>

      <TableCell className="resource-row__main">
        <h3 className="resource-row__title">
          <Link
            prefetch={false}
            href={detailHref}
            className="resource-row__link"
          >
            {title}
          </Link>
        </h3>
        <p className="resource-row__description">{description}</p>
        <div className="resource-row__mobile-meta">
          <span className="resource-row__mobile-category">{category}</span>
          <span className="resource-row__mobile-figures">
            <span>{addedDate}</span>
            <span aria-label={`${starCount} stars`}>Stars {starCount}</span>
          </span>
        </div>
      </TableCell>

      <TableCell className="resource-row__category">{category}</TableCell>
      <TableCell className="resource-row__added resource-row__figure">
        {addedDate}
      </TableCell>
      <TableCell className="resource-row__stars resource-row__figure">
        {starCount}
      </TableCell>

      <TableCell className="resource-row__actions">
        <div className="resource-row__action-group">
          <Button
            variant="ghost"
            size="icon-sm"
            type="button"
            className="resource-row__action"
            data-bookmarked={isBookmarked}
            onClick={() => onBookmark(id)}
            disabled={isBookmarkLoading}
            aria-label={
              isBookmarked
                ? `Remove ${title} from bookmarks`
                : `Bookmark ${title}`
            }
            aria-pressed={isBookmarked}
          >
            <Bookmark
              fill={isBookmarked ? "currentColor" : "none"}
              aria-hidden="true"
            />
          </Button>

          <Button
            asChild
            variant="ghost"
            size="icon-sm"
            className="resource-row__action"
          >
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${title}`}
            >
              <ExternalLink aria-hidden="true" />
            </a>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="icon-sm"
            className="resource-row__action"
          >
            <Link
              prefetch={false}
              href={detailHref}
              aria-label={`View details for ${title}`}
            >
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ItemCard;
