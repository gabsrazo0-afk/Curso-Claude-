import type { ReactNode } from "react";

/** Convierte `texto` entre comillas invertidas en <code> en línea. */
export function renderInline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, index) =>
    part.startsWith("`") && part.endsWith("`") && part.length > 2 ? (
      <code
        key={index}
        className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-primary-ink"
      >
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  );
}
