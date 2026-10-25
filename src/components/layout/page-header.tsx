import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href: string;
  }>;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon,
  breadcrumbs = [],
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <header className={cn("page-header", className)}>
      {breadcrumbs.length > 0 && (
        <div className="page-header__top">
          <Breadcrumb>
            <BreadcrumbList className="flex-wrap text-xs">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link prefetch={false} href="/">
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbs.map((breadcrumb, index) => (
                <React.Fragment key={`${breadcrumb.href}-${index}`}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage className="max-w-[18rem] truncate">
                        {breadcrumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link
                          prefetch={false}
                          href={breadcrumb.href}
                          className="max-w-[12rem] truncate"
                        >
                          {breadcrumb.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}

      <div className="page-header__title-row">
        {icon && <div className="page-header__icon">{icon}</div>}
        <h1 className="page-header__title">{title}</h1>
      </div>

      <p className="page-header__description">{description}</p>

      {actions && <div className="page-header__actions mt-5">{actions}</div>}
    </header>
  );
}
