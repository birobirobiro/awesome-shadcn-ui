"use client";

import { Sponsorship } from "./sponsorship";
import { motion } from "motion/react";

const fadeIn = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

export default function Hero() {
  return (
    <motion.div
      className="flex flex-col items-center text-center max-w-3xl mx-auto pt-8 sm:pt-12 pb-8 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Logo */}
      <motion.div variants={fadeIn} className="mb-8">
        <img src="/logo.svg" alt="awesome-shadcn/ui" className="h-24 w-auto" />
      </motion.div>

      {/* Title */}
      <motion.h1
        variants={fadeIn}
        className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4"
      >
        awesome-shadcn/ui
      </motion.h1>

      {/* Description */}
      <motion.p
        variants={fadeIn}
        className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8"
      >
        A curated list of awesome things related to{" "}
        <a
          href="https://ui.shadcn.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:underline underline-offset-4"
        >
          shadcn/ui
        </a>
      </motion.p>

      {/* Credits */}
      <motion.div
        variants={fadeIn}
        className="flex flex-col sm:flex-row items-center gap-2 text-sm text-muted-foreground"
      >
        <span>
          Created by{" "}
          <a
            href="https://birobirobiro.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline underline-offset-4"
          >
            birobirobiro.dev
          </a>
        </span>
        <span className="hidden sm:inline">·</span>
        <span>
          Site by{" "}
          <a
            href="https://bankkroll.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline underline-offset-4"
          >
            bankkroll.xyz
          </a>
        </span>
      </motion.div>

      {/* Sponsorship */}
      <motion.div variants={fadeIn} className="mt-4">
        <Sponsorship />
      </motion.div>
    </motion.div>
  );
}
