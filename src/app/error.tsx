"use client";

import { TriangleAlert } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <EmptyState
      tone="danger"
      icon={<TriangleAlert className="size-6" aria-hidden="true" />}
      title="Algo no ha salido bien"
      description="Se produjo un error inesperado al mostrar esta pantalla. Tu progreso guardado no se ha perdido."
      action={
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Reintentar</Button>
          <ButtonLink href="/" variant="secondary">
            Ir al panel
          </ButtonLink>
        </div>
      }
      headingLevel={1}
    />
  );
}
