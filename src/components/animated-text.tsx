
"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type AnimatedTextProps = {
  text: string
  className?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: i * 0.04 },
  }),
}

const childVariants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
  hidden: {
    opacity: 0,
    y: 20,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
}

export function AnimatedText({ text, className }: AnimatedTextProps) {
  const words = text.split(" ")

  return (
    <motion.p
      className={cn("flex flex-wrap justify-center", className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={childVariants}
          className="mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  )
}
