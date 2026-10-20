"use client";

import { ArrowRight, Clock, Lightbulb, ListChecks, Trophy, Zap } from "lucide-react";
import { Card, Eyebrow } from "@/components/ui/Card";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { curriculum } from "@/content/curriculum";
import { getNextMission } from "@/lib/progress";
import { mentor } from "@/lib/mentor-store";
import type { ProgressView } from "@/lib/use-progress";

export function NextMissionCard({ view }: { view: ProgressView }) {
  if (view.status === "loading") {
    return (
      <Card aria-label="Cargando siguiente misión" aria-busy="true">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-4 h-7 w-2/3" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-6 h-11 w-40" />
      </Card>
    );
  }

  const next = getNextMission(curriculum, view.state.completed);

  if (!next) {
    const firstModule = curriculum[0];
    return (
      <Card aria-labelledby="siguiente-mision" className="border-accent/40">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent-ink">
            <Trophy className="size-6" aria-hidden="true" />
          </span>
          <div>
            <Eyebrow className="text-accent-ink">Todo al día</Eyebrow>
            <h2 id="siguiente-mision" className="mt-1 text-xl font-semibold tracking-tight">
              No tienes misiones pendientes
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              Has completado todo el contenido publicado. Repasa cualquier misión mientras preparamos las
              siguientes.
            </p>
            <ButtonLink href={`/modulos/${firstModule.id}`} variant="secondary" className="mt-4">
              Repasar «{firstModule.title}»
            </ButtonLink>
          </div>
        </div>
      </Card>
    );
  }

  const { mission, module } = next;
  const savedStep = view.state.lastStep[mission.id];
  const started = savedStep !== undefined;
  const totalSteps = mission.steps.length + 1; // pasos + comprobación final
  const stepPercent = started ? ((Math.min(savedStep, totalSteps - 1) + 1) / totalSteps) * 100 : 0;

  return (
    <Card
      aria-labelledby="siguiente-mision"
      className="relative overflow-hidden border-primary/40 bg-[linear-gradient(135deg,var(--primary-soft),transparent_55%),var(--surface)]"
    >
      <Eyebrow>Siguiente misión · {module.title}</Eyebrow>
      <h2 id="siguiente-mision" className="mt-2 text-2xl font-semibold tracking-tight text-fg">
        {mission.title}
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-fg-muted">{mission.summary}</p>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-fg-muted" aria-label="Detalles de la misión">
        <li className="flex items-center gap-1.5">
          <Clock className="size-4" aria-hidden="true" />
          {mission.durationMinutes} min
        </li>
        <li className="flex items-center gap-1.5">
          <ListChecks className="size-4" aria-hidden="true" />
          {mission.steps.length} pasos y una comprobación
        </li>
        <li className="flex items-center gap-1.5 text-accent-ink">
          <Zap className="size-4" aria-hidden="true" />+{mission.xp} XP
        </li>
      </ul>

      {started && (
        <div className="mt-5 max-w-sm">
          <p className="mb-1.5 text-xs font-medium text-fg-muted">
            Te quedaste en el paso {Math.min(savedStep, totalSteps - 1) + 1} de {totalSteps}
          </p>
          <ProgressBar value={stepPercent} label={`Avance en ${mission.title}`} size="sm" />
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink
          href={`/misiones/${mission.id}`}
          size="lg"
          iconAfter={<ArrowRight className="size-4" aria-hidden="true" />}
        >
          {started ? "Continuar misión" : "Empezar misión"}
        </ButtonLink>
        <Button
          variant="ghost"
          size="lg"
          onClick={mentor.open}
          aria-haspopup="dialog"
          icon={<Lightbulb className="size-4" aria-hidden="true" />}
        >
          Pedir una pista
        </Button>
      </div>
    </Card>
  );
}
