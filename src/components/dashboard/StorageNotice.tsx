"use client";

import { Info, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { StorageStatus } from "@/lib/progress-store";

/** Avisa cuando el progreso no se puede guardar o se ha tenido que reiniciar. */
export function StorageNotice({ storage, onDismiss }: { storage: StorageStatus; onDismiss: () => void }) {
  if (storage === "ready") return null;

  if (storage === "memory") {
    return (
      <div role="status" className="flex items-start gap-3 rounded-2xl border border-warning-ink/40 bg-surface p-4 text-sm">
        <TriangleAlert className="mt-0.5 size-5 shrink-0 text-warning-ink" aria-hidden="true" />
        <p className="text-fg">
          <strong className="font-semibold">Tu progreso no se podrá guardar.</strong>{" "}
          <span className="text-fg-muted">
            Este navegador bloquea el almacenamiento local (por ejemplo, en modo privado). Puedes seguir
            aprendiendo, pero el progreso se perderá al cerrar la pestaña.
          </span>
        </p>
      </div>
    );
  }

  return (
    <div role="status" className="flex flex-wrap items-start gap-3 rounded-2xl border border-primary/40 bg-surface p-4 text-sm">
      <Info className="mt-0.5 size-5 shrink-0 text-primary-ink" aria-hidden="true" />
      <p className="flex-1 text-fg">
        <strong className="font-semibold">Hemos reiniciado tu progreso.</strong>{" "}
        <span className="text-fg-muted">Los datos guardados estaban dañados y no se podían leer.</span>
      </p>
      <Button variant="secondary" size="sm" onClick={onDismiss}>
        Entendido
      </Button>
    </div>
  );
}
