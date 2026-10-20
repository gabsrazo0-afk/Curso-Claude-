"use client";

import { LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { mentor } from "@/lib/mentor-store";
import { mentorName } from "@/content/mentor";

/** Abre el panel de ayuda del mentor. */
export function MentorButton({ compact = false }: { compact?: boolean }) {
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={mentor.open}
      aria-haspopup="dialog"
      aria-label={compact ? `Abrir ayuda de ${mentorName}, tu mentora` : undefined}
      icon={<LifeBuoy className="size-4" aria-hidden="true" />}
    >
      {compact ? <span className="hidden sm:inline">Ayuda</span> : "Pedir ayuda"}
    </Button>
  );
}
