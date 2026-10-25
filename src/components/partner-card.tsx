import type { ReactNode } from "react";
import { ArrowUpRight, PanelsTopLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PartnerCardProps {
  name: string;
  description: string;
  url: string | null;
  cta: string;
  logo?: ReactNode;
  open?: boolean;
}

export function PartnerCard({
  name,
  description,
  url,
  cta,
  logo,
  open = false,
}: PartnerCardProps) {
  return (
    <Card
      className={cn(
        "sponsor-rail__card relative focus-within:ring-2 focus-within:ring-ring",
        open && "sponsor-rail__card--open",
      )}
    >
      <CardHeader className="gap-3 p-0">
        <CardTitle>
          <span className="sponsor-rail__head">
            <span className="sponsor-rail__mark">
              {logo ?? <PanelsTopLeft aria-hidden="true" />}
            </span>
            <span className="sponsor-rail__name">{name}</span>
            {!url && (
              <Badge variant="outline" className="ml-auto">
                Preview
              </Badge>
            )}
          </span>
        </CardTitle>
        <CardDescription className="sponsor-rail__text">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-0">
        {url ? (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="sponsor-rail__cta w-full after:absolute after:inset-0 after:content-['']"
          >
            <a href={url} target="_blank" rel="noopener noreferrer sponsored">
              {cta}
              <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
            </a>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="sponsor-rail__cta w-full"
            disabled
          >
            {cta}
            <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
