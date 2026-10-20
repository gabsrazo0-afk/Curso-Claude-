import { Compass } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <EmptyState
      icon={<Compass className="size-6" aria-hidden="true" />}
      title="No encontramos esta página"
      description="Puede que el enlace esté mal escrito o que el contenido se haya movido."
      action={<ButtonLink href="/">Volver al panel</ButtonLink>}
      headingLevel={1}
    />
  );
}
