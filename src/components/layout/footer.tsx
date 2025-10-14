import { Github } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex flex-col items-center md:items-start space-y-4 md:space-y-2">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="logo"
                className="h-8 w-auto transition-transform"
              />
              <span className="text-lg font-bold">awesome-shadcn/ui</span>
            </Link>
            <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs">
              A curated list of awesome things related to shadcn/ui.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="flex space-x-4">
              <a
                href="https://github.com/birobirobiro/awesome-shadcn-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} awesome-shadcn/ui. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
