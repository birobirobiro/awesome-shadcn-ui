"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/40 backdrop-blur px-4">
      <div className="flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-x-2.5">
          <img
            src="logo.png"
            alt="logo"
            className="hidden md:block h-10 w-auto"
          />
          <p className="font-bold">awesome-shadcn/ui</p>
        </Link>
        <ModeToggle />
      </div>
    </header>
  );
}
