import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type CardProps = Omit<ComponentProps<"section">, "ref"> & { as?: "section" | "div" | "article" };

export function Card({ as: Tag = "section", className, ...props }: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-card sm:p-6",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: ComponentProps<"h2">) {
  return <h2 className={cn("text-base font-semibold tracking-tight text-fg", className)} {...props} />;
}

export function Eyebrow({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-mono text-[0.7rem] font-medium uppercase tracking-[0.16em] text-primary-ink",
        className,
      )}
      {...props}
    />
  );
}
