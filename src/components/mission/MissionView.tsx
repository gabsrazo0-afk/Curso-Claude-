"use client";

import { Hourglass, Lock } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { curriculum, getMission } from "@/content/curriculum";
import { getLockReason, getMissionState, getNextMission } from "@/lib/progress";
import { useProgress } from "@/lib/use-progress";
import { MissionPlayer } from "./MissionPlayer";

/** Decide qué mostrar según el estado de la misión: carga, bloqueo, preparación o contenido. */
export function MissionView({ missionId }: { missionId: string }) {
  const { view } = useProgress();
  const found = getMission(missionId);
  if (!found) return null;
  const { mission, module } = found;

  if (view.status === "loading") {
    return (
      <div className="mx-auto max-w-5xl" aria-busy="true" aria-label="Cargando misión">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-6 h-8 w-2/3" />
        <Skeleton className="mt-6 h-2 w-full" />
        <Card className="mt-6 space-y-3">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </Card>
      </div>
    );
  }

  const state = getMissionState(curriculum, mission.id, view.state.completed);

  if (state === "coming-soon") {
    return (
      <EmptyState
        tone="warning"
        headingLevel={1}
        icon={<Hourglass className="size-6" aria-hidden="true" />}
        title={`«${mission.title}» está en preparación`}
        description="Esta misión aún no tiene contenido publicado. Te avisaremos en la ruta en cuanto esté disponible."
        action={<ButtonLink href={`/modulos/${module.id}`}>Ver el módulo</ButtonLink>}
      />
    );
  }

  if (state === "locked") {
    const next = getNextMission(curriculum, view.state.completed);
    return (
      <EmptyState
        headingLevel={1}
        icon={<Lock className="size-6" aria-hidden="true" />}
        title={`«${mission.title}» está bloqueada`}
        description={getLockReason(curriculum, mission.id, view.state.completed) ?? "Completa las misiones anteriores."}
        action={
          next ? (
            <ButtonLink href={`/misiones/${next.mission.id}`}>Ir a «{next.mission.title}»</ButtonLink>
          ) : (
            <ButtonLink href="/">Volver al panel</ButtonLink>
          )
        }
      />
    );
  }

  return (
    <MissionPlayer
      key={mission.id}
      mission={mission}
      module={module}
      alreadyCompleted={state === "completed"}
      initialStep={state === "completed" ? 0 : (view.state.lastStep[mission.id] ?? 0)}
    />
  );
}
