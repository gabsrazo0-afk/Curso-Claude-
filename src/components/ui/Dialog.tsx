"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  /** "center" para confirmaciones, "side" para paneles laterales. */
  placement?: "center" | "side";
  className?: string;
}

/**
 * Diálogo modal basado en <dialog> nativo: atrapa el foco, cierra con Esc
 * y devuelve el foco al control que lo abrió sin código adicional.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  placement = "center",
  className,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        // Clic en el fondo (fuera del contenido) cierra el diálogo.
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "m-0 max-h-none max-w-none border border-border bg-surface p-0 text-fg shadow-card",
        placement === "center" &&
          "fixed inset-0 m-auto h-fit w-[min(28rem,calc(100vw-2rem))] rounded-[var(--radius-card)]",
        placement === "side" &&
          "fixed inset-y-0 right-0 left-auto h-dvh w-[min(26rem,100vw)] rounded-l-[var(--radius-card)] border-r-0",
        className,
      )}
    >
      {open && (
        <div className="flex h-full flex-col">
          <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
            <div>
              <h2 id={titleId} className="text-lg font-semibold tracking-tight">
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className="mt-1 text-sm text-fg-muted">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="grid size-9 shrink-0 place-items-center rounded-lg text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </header>
          <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        </div>
      )}
    </dialog>
  );
}
