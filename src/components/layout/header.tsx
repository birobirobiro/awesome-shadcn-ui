"use client";

import { PRSubmissionDialog } from "@/components/pr-submission-dialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Github, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="logo" className="h-8 w-auto" />
            <span className="font-bold text-sm hidden sm:inline">awesome-shadcn/ui</span>
          </Link>

          {/* Center: Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/categories"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/bookmarks"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Bookmarks
            </Link>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Sponsorship - Desktop */}
            <a
              href="https://shadcnstudio.com/?utm_source=awesome-shadcn-ui&utm_medium=banner&utm_campaign=header"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg viewBox="0 0 36 36" className="size-4 shrink-0">
                <path
                  fill="currentColor"
                  d="M36 18c0-9.94-8.06-18-18-18S0 8.06 0 18s8.06 18 18 18 18-8.06 18-18"
                />
                <path
                  fill="var(--background)"
                  d="M17.19 22.422a5.05 5.05 0 0 1 5.049-5.049h6.453v2.194h-6.453a2.854 2.854 0 0 0-2.853 2.855v6.634H17.19zm-2.298-.42.771.78-4.54 4.488-.77-.782-.772-.78 4.539-4.484.772.776zm11.97 3.708-1.552 1.551-4.514-4.514.776-.775.777-.78 4.511 4.518zm-9.847-11.19V7.88h2.194v6.637a5.05 5.05 0 0 1-5.047 5.049H7.708v-2.194h6.452a2.856 2.856 0 0 0 2.853-2.855zm9.894-2.949-4.544 4.488-1.542-1.56 4.542-4.488zm-11.46 2.693-1.553 1.55-4.514-4.513 1.553-1.551z"
                />
              </svg>
              <span className="hidden xl:inline">shadcnstudio.com</span>
            </a>

            {/* Submit Button - Desktop */}
            <div className="hidden md:block">
              <PRSubmissionDialog
                trigger={
                  <Button variant="outline" size="sm" className="h-8">
                    <Github className="mr-1.5 h-3.5 w-3.5" />
                    Submit
                  </Button>
                }
              />
            </div>

            <ThemeToggle />

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px]">
                <SheetHeader className="border-b pb-4 -mx-6 px-6">
                  <SheetTitle asChild>
                    <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm font-bold">
                      <img src="/logo.svg" alt="logo" className="h-6 w-auto" />
                      <span>awesome-shadcn/ui</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-1 mt-6">
                  <Link
                    href="/categories"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm py-3 text-foreground hover:text-muted-foreground transition-colors"
                  >
                    Categories
                  </Link>
                  <Link
                    href="/bookmarks"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm py-3 text-foreground hover:text-muted-foreground transition-colors"
                  >
                    Bookmarks
                  </Link>
                </nav>

                {/* Actions */}
                <div className="space-y-3 mt-6">
                  <PRSubmissionDialog
                    trigger={
                      <Button variant="outline" className="w-full justify-center">
                        <Github className="mr-2 h-4 w-4" />
                        Submit Resource
                      </Button>
                    }
                  />

                  <a
                    href="https://shadcnstudio.com/?utm_source=awesome-shadcn-ui&utm_medium=banner&utm_campaign=mobile"
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    <svg viewBox="0 0 36 36" className="size-3.5 shrink-0">
                      <path
                        fill="currentColor"
                        d="M36 18c0-9.94-8.06-18-18-18S0 8.06 0 18s8.06 18 18 18 18-8.06 18-18"
                      />
                      <path
                        fill="var(--background)"
                        d="M17.19 22.422a5.05 5.05 0 0 1 5.049-5.049h6.453v2.194h-6.453a2.854 2.854 0 0 0-2.853 2.855v6.634H17.19zm-2.298-.42.771.78-4.54 4.488-.77-.782-.772-.78 4.539-4.484.772.776zm11.97 3.708-1.552 1.551-4.514-4.514.776-.775.777-.78 4.511 4.518zm-9.847-11.19V7.88h2.194v6.637a5.05 5.05 0 0 1-5.047 5.049H7.708v-2.194h6.452a2.856 2.856 0 0 0 2.853-2.855zm9.894-2.949-4.544 4.488-1.542-1.56 4.542-4.488zm-11.46 2.693-1.553 1.55-4.514-4.513 1.553-1.551z"
                      />
                    </svg>
                    <span>Sponsored by shadcnstudio.com</span>
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
