"use client";

import { PRSubmissionDialog } from "@/components/pr-submission-dialog";
import { ThemeSwitcher } from "@/components/kibo-ui/theme-switcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Github, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { sponsors } from "@/components/sponsors/sponsors";
import { GithubStars } from "@/components/github-stars";
import { Logo } from "@/components/logo";
import { ModeToggle } from "@/components/theme-toggle";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left: Logo + Navigation */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Logo className="h-5 w-auto" />
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/categories"
                className={`text-sm transition-colors ${
                  pathname === "/categories" ||
                  pathname?.startsWith("/categories")
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Categories
              </Link>
              <Link
                href="/bookmarks"
                className={`text-sm transition-colors ${
                  pathname === "/bookmarks"
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Bookmarks
              </Link>
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Sponsorship - Desktop */}
            {sponsors.map((sponsor) => (
              <a
                key={sponsor.name}
                href={sponsor.url}
                target="_blank"
                rel="noopener sponsored"
                className="hidden lg:flex items-center gap-2 bg-muted/30 px-3 py-1.5 transition-colors duration-200 hover:bg-muted/50 border border-border/50"
              >
                {sponsor.LogoComponent}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground leading-none">
                    {sponsor.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {sponsor.description}
                  </span>
                </div>
              </a>
            ))}

            {/* Submit Button - Desktop - REMOVED, now in search filters */}

            <Button variant="outline" className="h-[34px] gap-1" asChild>
              <a
                href="https://github.com/birobirobiro/awesome-shadcn-ui"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                <GithubStars />
              </a>
            </Button>

            <ModeToggle />

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[380px] p-0">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <SheetHeader className="border-b px-6 py-4">
                    <SheetTitle asChild>
                      <Link
                        href="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3"
                      >
                        <Logo className="h-5 w-auto" />
                      </Link>
                    </SheetTitle>
                  </SheetHeader>

                  {/* Navigation */}
                  <div className="flex-1 px-6 py-6">
                    <nav className="flex flex-col gap-2">
                      <Link
                        href="/categories"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <span className="flex-1">Categories</span>
                      </Link>
                      <Link
                        href="/bookmarks"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <span className="flex-1">Bookmarks</span>
                      </Link>
                    </nav>

                    <div className="mt-8">
                      <PRSubmissionDialog
                        trigger={
                          <Button className="w-full justify-center gap-2">
                            <Github className="h-4 w-4" />
                            Submit Resource
                          </Button>
                        }
                      />
                    </div>
                  </div>

                  {/* Sponsored Section */}
                  <div className="border-t px-6 py-4 bg-muted/30">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono block text-center mb-3">
                      Sponsored by
                    </span>
                    <div className="flex flex-col gap-2">
                      {sponsors.map((sponsor) => (
                        <a
                          key={sponsor.name}
                          href={sponsor.url}
                          target="_blank"
                          rel="noopener sponsored"
                          className="flex items-center gap-3 bg-background px-4 py-3 transition-all duration-200 hover:shadow-md border"
                        >
                          {sponsor.LogoComponent}
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">
                              {sponsor.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {sponsor.description}
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
