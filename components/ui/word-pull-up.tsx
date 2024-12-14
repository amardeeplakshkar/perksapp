"use client";

import { motion, Variants } from "framer-motion";
import { cn } from "../../lib/utils";

interface WordPullUpProps {
  children?: React.ReactNode;   // Optional children
  content?: React.ReactNode;    // Optional content, can accept any React node
  words?: string;               // Optional words (backward compatibility)
  delayMultiple?: number;
  wrapperFramerProps?: Variants;
  framerProps?: Variants;
  className?: string;
}

export default function WordPullUp({
  children,
  content,
  words,
  wrapperFramerProps = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  },
  framerProps = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  },
  className,
}: WordPullUpProps) {
  // Always render `content` or `words`. `children` is optional.
  const renderedContent = content || (words && words.split(" ").map((word, i) => (
    <motion.span
      key={i}
      variants={framerProps}
      style={{ display: "inline-block", paddingRight: "5px" }}
    >
      {word === "" ? <span>&nbsp;</span> : word}
    </motion.span>
  )));

  return (
    <motion.h1
      variants={wrapperFramerProps}
      initial="hidden"
      animate="show"
      className={cn(
        "tracking-[-0.02em] drop-shadow-sm inline",
        className,
      )}
    >
      {renderedContent}
      {children}
    </motion.h1>
  );
}
