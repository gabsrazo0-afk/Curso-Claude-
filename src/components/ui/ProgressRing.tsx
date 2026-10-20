"use client";

import { motion } from "motion/react";

interface ProgressRingProps {
  value: number;
  size?: number;
  label: string;
}

export function ProgressRing({ value, size = 128, label }: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className="relative inline-grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - clamped / 100) }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <span className="absolute text-center" aria-hidden="true">
        <span className="block font-mono text-2xl font-semibold tabular-nums text-fg">{clamped}%</span>
        <span className="block text-[0.7rem] text-fg-muted">completado</span>
      </span>
    </div>
  );
}
