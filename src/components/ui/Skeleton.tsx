import { cn } from "@/lib/cn";

/** Bloque de carga estático (sin pulso constante, para equipos modestos). */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("rounded-lg bg-surface-2", className)} />;
}
