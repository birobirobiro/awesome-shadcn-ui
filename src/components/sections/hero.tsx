"use client";

import { motion } from "framer-motion";

// Orchestrates the entire hero section animation
const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      // Stagger the logo and the text block
      staggerChildren: 0.6,
    },
  },
};

// Animation for the logo: starts large, scales down
const logoVariants = {
  hidden: { opacity: 0, scale: 1.5, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      mass: 1,
    },
  },
};

// Orchestrates the animation for the block of text elements
const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      // Stagger each line of text
      staggerChildren: 0.15,
    },
  },
};

// Standard animation for individual text elements
const textItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function Hero() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center space-y-4 text-center"
      variants={heroContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Logo animates in first */}
      <motion.div variants={logoVariants}>
        <img
          src="/logo.svg"
          alt="awesome-shadcn/ui logo"
          className="max-h-36"
        />
      </motion.div>

      {/* Text content animates in as a group after the logo */}
      <motion.div className="space-y-2" variants={textContainerVariants}>
        <motion.h1
          className="text-4xl font-bold tracking-tighter sm:text-5xl"
          variants={textItemVariants}
        >
          awesome-shadcn/ui
        </motion.h1>
        <motion.p
          className="max-w-[900px] text-muted-foreground mb-4"
          variants={textItemVariants}
        >
          A curated list of awesome things related to{" "}
          <a
            href="https://ui.shadcn.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            shadcn/ui
          </a>
        </motion.p>
        <motion.p
          className="text-sm text-muted-foreground"
          variants={textItemVariants}
        >
          Created by:{" "}
          <a
            href="https://birobirobiro.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            birobirobiro.dev
          </a>
        </motion.p>
        <motion.p
          className="text-xs text-muted-foreground"
          variants={textItemVariants}
        >
          Site by:{" "}
          <a
            href="https://bankkroll.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            bankkroll.xyz
          </a>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
