import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

import { Sponsor } from "@/components/sponsors/sponsors";

interface SponsorCardProps {
  sponsor: Sponsor;
}

const SponsorCard = ({ sponsor }: SponsorCardProps) => {
  return (
    <TableRow className="resource-row">
      <TableCell className="resource-row__index">
        <span className="resource-row__sponsor-mark">
          {sponsor.LogoComponent}
        </span>
      </TableCell>

      <TableCell className="resource-row__main">
        <h3 className="resource-row__title">
          <a
            href={sponsor.url}
            target="_blank"
            rel="noopener sponsored"
            className="resource-row__link"
          >
            {sponsor.name}
          </a>
        </h3>
        <p className="resource-row__description">{sponsor.description}</p>
        <div className="resource-row__mobile-meta">Sponsored</div>
      </TableCell>

      <TableCell className="resource-row__category" colSpan={3}>
        Sponsored
      </TableCell>

      <TableCell className="resource-row__actions">
        <div className="resource-row__action-group">
          <Button
            asChild
            variant="ghost"
            size="icon-sm"
            className="resource-row__action"
          >
            <a
              href={sponsor.url}
              target="_blank"
              rel="noopener sponsored"
              aria-label={`Visit ${sponsor.name}`}
            >
              <ArrowUpRight aria-hidden="true" />
            </a>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default SponsorCard;
