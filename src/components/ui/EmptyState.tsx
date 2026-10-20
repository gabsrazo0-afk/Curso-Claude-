import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: ReactNode;
  action?: ReactNode;
  tone?: "neutral" | "danger" | "warning";
  headingLevel?: 1 | 2;
}

/** Estado vacío, bloqueado o de error con una acción clara para continuar. */
export function EmptyState({ icon, title, description, action, tone = "neutral", headingLevel = 2 }: EmptyStateProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center rounded-[var(--radius-card)] border border-border bg-surface px-6 py-10 text-center shadow-card">
      <span
        className={cn(
          "grid size-12 place-items-center rounded-2xl",
          tone === "neutral" && "bg-primary-soft text-primary-ink",
          tone === "danger" && "bg-danger-soft text-danger-ink",
          tone === "warning" && "bg-[color-mix(in_srgb,var(--warning-ink)_14%,transparent)] text-warning-ink",
        )}
      >
        {icon}
      </span>
      <Heading className="mt-4 text-xl font-semibold tracking-tight text-fg">{title}</Heading>
      <div className="mt-2 text-sm leading-relaxed text-fg-muted">{description}</div>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
