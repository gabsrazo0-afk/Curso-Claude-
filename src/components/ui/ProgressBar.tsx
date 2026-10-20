"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";

interface ProgressBarProps {
  value: number;
  label: string;
  /** Muestra el texto del porcentaje junto a la barra. */
  showValue?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function ProgressBar({ value, label, showValue, size = "md", className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        className={cn(
          "relative flex-1 overflow-hidden rounded-full bg-surface-2",
          size === "sm" ? "h-1.5" : "h-2.5",
        )}
      >
        <motion.div
          className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-accent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: clamped / 100 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      {showValue && (
        <span className="w-10 text-right font-mono text-xs tabular-nums text-fg-muted">
          {clamped}%
        </span>
      )}
    </div>
  );
}
