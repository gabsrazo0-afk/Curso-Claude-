import { Sparkles } from "lucide-react";
import { Eyebrow } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ProgressView } from "@/lib/use-progress";

export function WelcomeHero({ view }: { view: ProgressView }) {
  const stats = view.status === "ready" ? view.stats : null;
  const isNew = !stats || stats.completedCount === 0;
  const allDone = stats !== null && stats.availableCount > 0 && stats.completedCount >= stats.availableCount;

  return (
    <section aria-labelledby="bienvenida" className="py-2">
      <Eyebrow className="flex items-center gap-2">
        <Sparkles className="size-3.5" aria-hidden="true" />
        Future Lab · Aprende haciendo
      </Eyebrow>
      <h1 id="bienvenida" className="mt-3 text-3xl font-semibold tracking-tight text-balance text-fg sm:text-4xl">
        {isNew ? (
          <>
            Te damos la bienvenida a{" "}
            <span className="bg-gradient-to-r from-primary-ink to-accent-ink bg-clip-text text-transparent">
              Claude Code Academy
            </span>
          </>
        ) : allDone ? (
          "¡Lo has completado todo!"
        ) : (
          "Hola de nuevo. Sigamos aprendiendo."
        )}
      </h1>
      <div className="mt-3 max-w-2xl text-base leading-relaxed text-fg-muted" aria-live="polite">
        {view.status === "loading" ? (
          <div className="space-y-2 pt-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : isNew ? (
          <p>
            Aprende a programar con Claude Code desde cero, con misiones cortas y prácticas. Tu progreso se
            guarda en este navegador, sin cuentas ni contraseñas.
          </p>
        ) : allDone ? (
          <p>
            Has terminado las {stats?.availableCount} misiones disponibles. Muy pronto llegarán nuevos módulos.
          </p>
        ) : (
          <p>
            Llevas {stats?.completedCount} de {stats?.availableCount} misiones disponibles. Cada misión que
            completas desbloquea la siguiente.
          </p>
        )}
      </div>
    </section>
  );
}
