"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, TriangleAlert } from "lucide-react";
import type { CodeSnippet } from "@/content/types";

type CopyState = "idle" | "copied" | "error";

export function CodeBlock({ snippet }: { snippet: CodeSnippet }) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(snippet.content);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
    timer.current = setTimeout(() => setCopyState("idle"), 2000);
  }

  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-code-bg">
      <figcaption className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2">
        <span className="flex items-center gap-2 text-xs text-[#b7bbd0]">
          <span className="font-mono uppercase tracking-wider text-[#a99fff]">{snippet.language}</span>
          {snippet.caption && <span>· {snippet.caption}</span>}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-[#d9dcf0] transition-colors hover:bg-white/10"
        >
          {copyState === "copied" ? (
            <Check className="size-3.5 text-[#35d6c3]" aria-hidden="true" />
          ) : copyState === "error" ? (
            <TriangleAlert className="size-3.5 text-[#f5c26b]" aria-hidden="true" />
          ) : (
            <Copy className="size-3.5" aria-hidden="true" />
          )}
          {copyState === "copied" ? "Copiado" : copyState === "error" ? "No se pudo copiar" : "Copiar"}
          <span className="sr-only"> código</span>
        </button>
      </figcaption>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-sm leading-relaxed text-code-fg">
        <code>{snippet.content}</code>
      </pre>
      <span className="sr-only" aria-live="polite">
        {copyState === "copied" ? "Código copiado al portapapeles" : copyState === "error" ? "No se pudo copiar el código" : ""}
      </span>
    </figure>
  );
}
