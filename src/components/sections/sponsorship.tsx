"use client";

import { motion } from "motion/react";

export function Sponsorship() {
  return (
    <motion.section
      className="my-8 sm:my-10 flex justify-center"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
          Sponsored by
        </span>
        <a
          href="https://shadcnstudio.com/?utm_source=awesome-shadcn-ui&utm_medium=banner&utm_campaign=homepage"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex items-center gap-2.5 rounded-md bg-muted/30 px-3 py-2 transition-colors duration-200 hover:bg-muted/50 border border-border/50"
        >
          <svg viewBox="0 0 36 36" className="size-6 shrink-0 sm:size-7">
            <path
              fill="var(--foreground)"
              d="M36 18c0-9.94-8.06-18-18-18S0 8.06 0 18s8.06 18 18 18 18-8.06 18-18"
            />
            <path
              fill="var(--background)"
              d="M17.19 22.422a5.05 5.05 0 0 1 5.049-5.049h6.453v2.194h-6.453a2.854 2.854 0 0 0-2.853 2.855v6.634H17.19zm-2.298-.42.771.78-4.54 4.488-.77-.782-.772-.78 4.539-4.484.772.776zm11.97 3.708-1.552 1.551-4.514-4.514.776-.775.777-.78 4.511 4.518zm-9.847-11.19V7.88h2.194v6.637a5.05 5.05 0 0 1-5.047 5.049H7.708v-2.194h6.452a2.856 2.856 0 0 0 2.853-2.855zm9.894-2.949-4.544 4.488-1.542-1.56 4.542-4.488zm-11.46 2.693-1.553 1.55-4.514-4.513 1.553-1.551z"
            />
          </svg>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm leading-tight font-medium text-foreground whitespace-nowrap">
              shadcnstudio.com
            </span>
            <span className="text-xs leading-tight text-muted-foreground whitespace-nowrap">
              shadcn blocks &amp; templates
            </span>
          </div>
        </a>
      </div>
    </motion.section>
  );
}
