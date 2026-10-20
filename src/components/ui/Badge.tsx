import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "neutral" | "primary" | "accent" | "warning";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface-2 text-fg-muted",
  primary: "bg-primary-soft text-primary-ink",
  accent: "bg-accent-soft text-accent-ink",
  warning: "bg-[color-mix(in_srgb,var(--warning-ink)_14%,transparent)] text-warning-ink",
};

export function Badge({
  tone = "neutral",
  icon,
  children,
  className,
}: {
  tone?: BadgeTone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
