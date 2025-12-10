"use client";

import { PRSubmissionDialog } from "@/components/pr-submission-dialog";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useCategories } from "@/hooks/use-categories";
import { ArrowRight, Bookmark, ExternalLink, Github, Menu } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const { categories, isLoading } = useCategories();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur px-2 sm:px-4">
      <div className="w-full flex items-center justify-between">
        <div className="w-full flex items-center max-sm:justify-between py-2 sm:py-4 gap-4">
          <Link href="/" className="flex items-center gap-x-2.5">
            <img src="/logo.svg" alt="logo" className="block h-10 w-auto" />
            <p className="font-bold">awesome-shadcn/ui</p>
          </Link>
          <div className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-accent">
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[800px] p-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {isLoading ? (
                          <div className="col-span-full text-center py-8">
                            <div className="animate-pulse text-muted-foreground">
                              Loading categories...
                            </div>
                          </div>
                        ) : (
                          <>
                            {categories.map((category) => (
                              <motion.div
                                key={category.title}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={`/categories/${category.slug}`}
                                    className="group block rounded-lg border border-dashed border-primary/20 bg-card p-4 transition-all hover:border-border hover:shadow-md h-full"
                                  >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                                        {category.title}
                                      </h3>
                                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                      {category.description}
                                    </p>
                                  </Link>
                                </NavigationMenuLink>
                              </motion.div>
                            ))}
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              className="md:col-span-2 lg:col-span-3"
                            >
                              <NavigationMenuLink asChild>
                                <Link
                                  href="/categories"
                                  className="group block rounded-lg border border-dashed border-primary/20 bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md h-full"
                                >
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                                      View All Categories
                                    </h3>
                                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                    Browse all categories and discover more
                                    resources
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </motion.div>
                          </>
                        )}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/bookmarks"
                      className="bg-transparent hover:bg-accent font-medium"
                    >
                      Bookmarks
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors">
                  <Menu className="h-4 w-4" />
                  <span className="hidden sm:inline">Categories</span>
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[95%] sm:w-[420px] p-0 flex flex-col"
              >
                <SheetHeader className="border-b">
                  <SheetTitle className="flex items-center gap-2 text-xl">
                    <Link href="/" className="flex items-center gap-x-2.5">
                      <img
                        src="/logo.svg"
                        alt="logo"
                        className="block h-10 w-auto"
                      />
                      <p className="font-bold">awesome-shadcn/ui</p>
                    </Link>{" "}
                  </SheetTitle>
                </SheetHeader>

                <ScrollArea className="flex-1 px-3">
                  <div className="space-y-2">
                    {/* Submit Button - First item in mobile sheet */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PRSubmissionDialog
                        trigger={
                          <button className="group block w-full rounded-xl border-2 border-dashed border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10 p-3 transition-all hover:border-primary/50 hover:shadow-lg hover:from-primary/10 hover:to-primary/15">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <Github className="h-4 w-4 text-primary" />
                                <h3 className="font-semibold text-base text-primary group-hover:text-primary/80 transition-colors">
                                  Submit Resource
                                </h3>
                              </div>
                              <ArrowRight className="h-4 w-4 text-primary group-hover:text-primary/80 group-hover:translate-x-1 transition-all flex-shrink-0" />
                            </div>
                          </button>
                        }
                      />
                    </motion.div>

                    {/* Bookmarks Link */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 }}
                    >
                      <Link
                        href="/bookmarks"
                        className="group block rounded-xl border-2 border-dashed border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10 p-3 transition-all hover:border-primary/50 hover:shadow-lg hover:from-primary/10 hover:to-primary/15"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Bookmark className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold text-base text-primary group-hover:text-primary/80 transition-colors">
                              Bookmarks
                            </h3>
                          </div>
                          <ArrowRight className="h-4 w-4 text-primary group-hover:text-primary/80 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                      </Link>
                    </motion.div>

                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="animate-pulse text-muted-foreground">
                          <div className="h-4 bg-muted rounded w-32 mx-auto mb-2"></div>
                          <div className="h-3 bg-muted rounded w-24 mx-auto"></div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {categories.map((category, index) => (
                          <motion.div
                            key={category.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: (index + 2) * 0.05,
                            }}
                          >
                            <Link
                              href={`/categories/${category.slug}`}
                              className="group block rounded-xl border border-dashed border-primary/20 bg-card/50 backdrop-blur-sm p-2 transition-all hover:border-primary/40 hover:shadow-lg hover:bg-card/80"
                              onClick={() => setIsOpen(false)}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
                                  {category.title}
                                </h3>
                                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                              </div>
                            </Link>
                          </motion.div>
                        ))}

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: (categories.length + 2) * 0.05,
                          }}
                        >
                          <Link
                            href="/categories"
                            className="group block rounded-xl border-2 border-dashed border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10 p-2 transition-all hover:border-primary/50 hover:shadow-lg hover:from-primary/10 hover:to-primary/15"
                            onClick={() => setIsOpen(false)}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="font-semibold text-base text-primary group-hover:text-primary/80 transition-colors">
                                View All Categories
                              </h3>
                              <ExternalLink className="h-4 w-4 text-primary group-hover:text-primary/80 group-hover:translate-x-1 transition-all flex-shrink-0" />
                            </div>
                          </Link>
                        </motion.div>
                      </>
                    )}
                  </div>
                </ScrollArea>

                <SheetFooter className="px-6 py-4 border-t bg-muted/30">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <a
                        href="https://github.com/birobirobiro/awesome-shadcn-ui"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github className="h-4 w-4" />
                        <span className="hidden sm:inline">GitHub</span>
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThemeToggle />
                    </div>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <PRSubmissionDialog
            trigger={
              <Button variant="default">
                <Github className="mr-1 h-3 w-3" />
                Submit
              </Button>
            }
          />
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
