"use client";

import { Github } from "@/components/icons/github-icon";

import { PageHeader } from "@/components/layout/page-header";
import { WebsitePreview } from "@/components/website-preview";
import { Button } from "@/components/ui/button";
import { type Resource } from "@/hooks/use-readme";
import { categoryNameToSlug } from "@/lib/slugs";
import { formatResourceDate, formatStarCount } from "@/lib/utils";
import { ArrowRight, ExternalLink, Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Libs and Components":
    "Essential libraries and reusable components built with shadcn/ui",
  Registries: "Component registries and collections for shadcn/ui",
  "Plugins and Extensions":
    "Tools and extensions that enhance your shadcn/ui workflow",
  "Colors and Customizations":
    "Themes, color palettes, and customization utilities",
  Animations: "Animation libraries and motion components for shadcn/ui",
  Tools: "Development tools, generators, and utilities for shadcn/ui projects",
  "Websites and Portfolios":
    "Real-world examples and inspiration for your projects",
  Platforms: "Platforms and services that integrate with shadcn/ui",
  Ports: "Ports of shadcn/ui to other frameworks and technologies",
  "Design System": "Complete design systems and component libraries",
  "Boilerplates / Templates":
    "Starter templates and boilerplates for quick project setup",
};

interface ItemPageContentProps {
  item: Resource;
  relatedItems: Resource[];
  categorySlug: string;
  categoryName: string;
}

export function ItemPageContent({
  item,
  relatedItems,
  categorySlug,
  categoryName,
}: ItemPageContentProps) {
  const [faviconUrl, setFaviconUrl] = useState<string>(() => {
    const domain = new URL(item.url).hostname;
    return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
  });

  const isGitHubUrl = (url: string) => url.includes("github.com");
  const domain = new URL(item.url).hostname.replace(/^www\./, "");

  return (
    <div className="shell">
      <PageHeader
        title={item.name}
        description={item.description}
        icon={
          faviconUrl ? (
            <img
              src={faviconUrl}
              alt=""
              className="h-6 w-6"
              onError={() => setFaviconUrl("")}
            />
          ) : (
            <Globe className="h-4 w-4" aria-hidden="true" />
          )
        }
        breadcrumbs={[
          { label: "Categories", href: "/categories" },
          { label: categoryName, href: `/categories/${categorySlug}` },
          {
            label: item.name,
            href: `/categories/${categorySlug}/${item.id}`,
          },
        ]}
        actions={
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="page-header__meta mt-0">
              <span className="page-header__meta-item">
                <span className="page-header__meta-label">Added</span>
                <span className="page-header__meta-value">
                  {formatResourceDate(item.date)}
                </span>
              </span>
              <span className="page-header__meta-item">
                <span className="page-header__meta-label">Category</span>
                <span className="page-header__meta-value">{item.category}</span>
              </span>
              {item.stars !== undefined && (
                <span className="page-header__meta-item">
                  <span className="page-header__meta-label">Stars</span>
                  <span className="page-header__meta-value">
                    {formatStarCount(item.stars)}
                  </span>
                </span>
              )}
            </div>

            <Button asChild className="gap-2">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                {isGitHubUrl(item.url) ? (
                  <Github className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                )}
                {isGitHubUrl(item.url) ? "View on GitHub" : "Visit website"}
              </a>
            </Button>
          </div>
        }
      />

      <div className="item-layout">
        <div className="item-preview">
          <div className="item-preview__head">
            <div className="item-preview__domain">
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{domain}</span>
            </div>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Open
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
          <div className="item-preview__body">
            <WebsitePreview url={item.url} name={item.name} />
          </div>
        </div>

        <aside className="item-sidebar">
          <div className="side-panel">
            <h2 className="side-panel__title">Category</h2>
            <p className="side-panel__text">
              {CATEGORY_DESCRIPTIONS[item.category] ||
                "A collection of shadcn/ui related resources"}
            </p>
            <div className="mt-4">
              <Button
                asChild
                variant="outline"
                className="w-full justify-between"
              >
                <Link
                  prefetch={false}
                  href={`/categories/${categoryNameToSlug(item.category)}`}
                >
                  View all in {item.category}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          {relatedItems.length > 0 && (
            <div className="side-panel">
              <h2 className="side-panel__title">Related resources</h2>
              <ul className="related-list">
                {relatedItems.map((relatedItem) => (
                  <li key={relatedItem.id}>
                    <Link
                      prefetch={false}
                      href={`/categories/${categoryNameToSlug(item.category)}/${relatedItem.id}`}
                      className="related-row"
                    >
                      <span className="related-row__title">
                        {relatedItem.name}
                      </span>
                      <span className="related-row__meta">
                        {relatedItem.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
