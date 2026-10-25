"use client";

import { Github } from "@/components/icons/github-icon";

import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { memo, useState } from "react";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { GitHubStars } from "@/components/github-stars";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { ModeToggle } from "@/components/theme-toggle";
import { PRSubmissionDialog } from "@/components/pr-submission-dialog";
import { sponsors } from "@/components/sponsors/sponsors";
import { usePathname } from "next/navigation";

export function NavLinks() {
  const pathname = usePathname();
  const isCategories =
    pathname === "/categories" || pathname?.startsWith("/categories");
  const isBookmarks = pathname === "/bookmarks";

  const links = [
    { href: "/", label: "Resources", active: pathname === "/" },
    { href: "/categories", label: "Categories", active: isCategories },
    { href: "/bookmarks", label: "Bookmarks", active: isBookmarks },
  ];

  return (
    <NavigationMenu
      viewport={false}
      className="hidden lg:flex"
      aria-label="Primary"
    >
      <NavigationMenuList className="gap-6">
        {links.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink
              asChild
              active={item.active}
              className="nav-link bg-transparent px-0 hover:bg-transparent focus:bg-transparent data-active:bg-transparent data-active:hover:bg-transparent data-active:focus:bg-transparent"
            >
              <Link
                prefetch={false}
                href={item.href}
                aria-current={item.active ? "page" : undefined}
              >
                {item.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="h-11! w-11! lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full p-0 sm:max-w-sm">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-border px-6 py-5">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Browse resources, categories, and bookmarks.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 px-6 py-6">
            <nav className="flex flex-col" aria-label="Mobile">
              {[
                { href: "/", label: "Resources" },
                { href: "/categories", label: "Categories" },
                { href: "/bookmarks", label: "Bookmarks" },
              ].map((item) => (
                <Link
                  key={item.href}
                  prefetch={false}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-b border-border py-4 text-lg font-medium tracking-[-0.01em] text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6">
              <PRSubmissionDialog
                trigger={
                  <Button className="w-full justify-center gap-2">
                    <Github className="h-4 w-4" aria-hidden="true" />
                    Submit a resource
                  </Button>
                }
              />
            </div>
          </div>

          <div className="border-t border-border bg-paper-2 px-6 py-5">
            <p className="text-xs text-muted-foreground">Sponsored by</p>
            <div className="mt-3 flex flex-col gap-2">
              {sponsors.map((sponsor) => (
                <a
                  key={sponsor.name}
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener sponsored"
                  className="flex items-center gap-3 rounded-[var(--radius-control)] border border-border bg-background px-3 py-2.5 transition-colors duration-[var(--dur-micro)] hover:bg-muted"
                >
                  {sponsor.LogoComponent}
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground">
                      {sponsor.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {sponsor.description}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export const Header = memo(function Header() {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <div className="flex min-w-0 items-center gap-6">
          <Link
            prefetch={false}
            href="/"
            className="brand shrink-0"
            aria-label="awesome-shadcn/ui home"
          >
            <Logo className="brand__mark" />
            <span className="whitespace-nowrap text-xs font-medium sm:text-sm">
              awesome-shadcn/ui
            </span>
          </Link>
          <NavLinks />
        </div>

        <div className="flex items-center gap-1.5">
          <div className="hidden sm:block">
            <GitHubStars />
          </div>
          <ModeToggle />
          <PRSubmissionDialog
            trigger={
              <Button size="sm" className="hidden h-10 gap-1.5 lg:inline-flex">
                <Github className="h-3.5 w-3.5" aria-hidden="true" />
                Submit
              </Button>
            }
          />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
});
