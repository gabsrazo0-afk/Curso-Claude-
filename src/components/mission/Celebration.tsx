"use client";

import { motion, useReducedMotion } from "motion/react";
import { Trophy } from "lucide-react";

const PARTICLES = 14;

/** Celebración breve y única al completar una misión. */
export function Celebration() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto grid size-24 place-items-center" aria-hidden="true">
      {!reduceMotion &&
        Array.from({ length: PARTICLES }, (_, i) => {
          const angle = (i / PARTICLES) * Math.PI * 2;
          const distance = 56 + (i % 3) * 10;
          return (
            <motion.span
              key={i}
              className="absolute size-2 rounded-full"
              style={{ background: i % 2 === 0 ? "var(--primary)" : "var(--accent)" }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
              animate={{
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                opacity: 0,
                scale: 1,
              }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
            />
          );
        })}
      <motion.span
        className="grid size-20 place-items-center rounded-3xl bg-gradient-to-br from-primary-fill to-accent text-white shadow-[0_16px_40px_-12px_var(--primary)]"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
      >
        <Trophy className="size-9" />
      </motion.span>
    </div>
  );
}
