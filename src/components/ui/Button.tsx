import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-200 " +
  "disabled:cursor-not-allowed disabled:opacity-50 motion-safe:active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary-fill text-white shadow-[0_8px_24px_-10px_var(--primary)] hover:bg-[color-mix(in_srgb,var(--primary-fill)_88%,white)]",
  secondary:
    "border border-border-strong bg-surface text-fg hover:border-primary hover:text-primary-ink",
  ghost: "text-fg-muted hover:bg-surface-2 hover:text-fg",
  danger: "bg-[#b42323] text-white hover:bg-[#9c1d1d]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

interface StyleProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconAfter?: ReactNode;
}

export function buttonClasses({ variant = "primary", size = "md" }: StyleProps = {}) {
  return cn(base, variants[variant], sizes[size]);
}

type ButtonProps = ComponentProps<"button"> & StyleProps;

export function Button({
  variant,
  size,
  icon,
  iconAfter,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={cn(buttonClasses({ variant, size }), className)} {...props}>
      {icon}
      {children}
      {iconAfter}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & StyleProps;

export function ButtonLink({
  variant,
  size,
  icon,
  iconAfter,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={cn(buttonClasses({ variant, size }), className)} {...props}>
      {icon}
      {children}
      {iconAfter}
    </Link>
  );
}
