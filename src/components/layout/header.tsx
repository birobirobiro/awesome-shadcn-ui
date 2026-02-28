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
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left: Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img src="/logo.svg" alt="logo" className="h-8 w-auto" />
            <span className="font-bold text-sm hidden sm:inline">
              awesome-shadcn/ui
            </span>
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
              href="https://shadcnstudio.com/?utm_source=awesome-shadcn-ui&utm_medium=banner&utm_campaign=github"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="hidden lg:flex items-center gap-2 bg-muted/30 px-3 py-1.5 transition-colors duration-200 hover:bg-muted/50 border border-border/50"
            >
              <svg
                viewBox="0 0 328 328"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 shrink-0"
              >
                <rect
                  width="328"
                  height="328"
                  rx="164"
                  className="fill-foreground"
                />
                <path
                  d="M165.018 72.3008V132.771C165.018 152.653 148.9 168.771 129.018 168.771H70.2288"
                  strokeWidth="20"
                  className="stroke-background"
                />
                <path
                  d="M166.627 265.241L166.627 204.771C166.627 184.889 182.744 168.771 202.627 168.771L261.416 168.771"
                  strokeWidth="20"
                  className="stroke-background"
                />
                <line
                  x1="238.136"
                  y1="98.8184"
                  x2="196.76"
                  y2="139.707"
                  strokeWidth="20"
                  className="stroke-background"
                />
                <line
                  x1="135.688"
                  y1="200.957"
                  x2="94.3128"
                  y2="241.845"
                  stroke="white"
                  strokeWidth="20"
                  className="dark:stroke-black"
                />
                <line
                  x1="133.689"
                  y1="137.524"
                  x2="92.5566"
                  y2="96.3914"
                  stroke="white"
                  strokeWidth="20"
                  className="dark:stroke-black"
                />
                <line
                  x1="237.679"
                  y1="241.803"
                  x2="196.547"
                  y2="200.671"
                  stroke="white"
                  strokeWidth="20"
                  className="dark:stroke-black"
                />
              </svg>
              <span className="text-sm font-medium text-foreground max-xl:hidden">
                shadcnstudio.com
              </span>
              <span className="text-xs text-muted-foreground max-2xl:hidden">
                (shadcn blocks & templates)
              </span>
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

            <ThemeSwitcher />

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
                        <img
                          src="/logo.svg"
                          alt="logo"
                          className="h-7 w-auto"
                        />
                        <span className="text-base font-bold">
                          awesome-shadcn/ui
                        </span>
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
                    <a
                      href="https://shadcnstudio.com/?utm_source=awesome-shadcn-ui&utm_medium=banner&utm_campaign=github"
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="flex items-center justify-center bg-background px-4 py-3 transition-all duration-200 hover:shadow-md border"
                    >
                      <svg
                        viewBox="0 0 328 328"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                      >
                        <rect
                          width="328"
                          height="328"
                          rx="164"
                          fill="black"
                          className="dark:fill-white"
                        />
                        <path
                          d="M165.018 72.3008V132.771C165.018 152.653 148.9 168.771 129.018 168.771H70.2288"
                          stroke="white"
                          strokeWidth="20"
                          className="dark:stroke-black"
                        />
                        <path
                          d="M166.627 265.241L166.627 204.771C166.627 184.889 182.744 168.771 202.627 168.771L261.416 168.771"
                          stroke="white"
                          strokeWidth="20"
                          className="dark:stroke-black"
                        />
                        <line
                          x1="238.136"
                          y1="98.8184"
                          x2="196.76"
                          y2="139.707"
                          stroke="white"
                          strokeWidth="20"
                          className="dark:stroke-black"
                        />
                        <line
                          x1="135.688"
                          y1="200.957"
                          x2="94.3128"
                          y2="241.845"
                          stroke="white"
                          strokeWidth="20"
                          className="dark:stroke-black"
                        />
                        <line
                          x1="133.689"
                          y1="137.524"
                          x2="92.5566"
                          y2="96.3914"
                          stroke="white"
                          strokeWidth="20"
                          className="dark:stroke-black"
                        />
                        <line
                          x1="237.679"
                          y1="241.803"
                          x2="196.547"
                          y2="200.671"
                          stroke="white"
                          strokeWidth="20"
                          className="dark:stroke-black"
                        />
                      </svg>
                    </a>
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
