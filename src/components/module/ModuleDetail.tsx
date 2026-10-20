"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Hourglass, Lock, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card, Eyebrow } from "@/components/ui/Card";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { missionStateMeta, moduleStateMeta } from "@/components/dashboard/statusMeta";
import { curriculum } from "@/content/curriculum";
import { getLockReason, getMissionState, getModuleProgress, getModuleState } from "@/lib/progress";
import { useProgress } from "@/lib/use-progress";
import { cn } from "@/lib/cn";

export function BackToDashboard() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-fg-muted transition-colors hover:text-primary-ink"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      Volver al panel
    </Link>
  );
}

export function ModuleDetail({ moduleId }: { moduleId: string }) {
  const { view } = useProgress();
  const index = curriculum.findIndex((m) => m.id === moduleId);
  const courseModule = curriculum[index];

  if (!courseModule) return null;

  const ready = view.status === "ready";
  const completed = ready ? view.state.completed : {};
  const state = ready ? getModuleState(curriculum, moduleId, completed) : null;
  const progress = getModuleProgress(courseModule, completed);
  const previousModule = curriculum[index - 1];

  return (
    <div className="mx-auto max-w-3xl">
      <BackToDashboard />

      <header className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl border border-primary/40 bg-primary-soft text-primary-ink">
          <ModuleIcon name={courseModule.icon} className="size-6" />
        </span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <Eyebrow>Módulo {index + 1}</Eyebrow>
            {state && (
              <Badge tone={moduleStateMeta[state].tone} icon={moduleStateMeta[state].icon}>
                {moduleStateMeta[state].label}
              </Badge>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-fg">{courseModule.title}</h1>
          <p className="mt-2 leading-relaxed text-fg-muted">{courseModule.description}</p>
          {ready && (
            <div className="mt-4 flex max-w-sm items-center gap-3">
              <ProgressBar value={progress.percent} label={`Progreso del módulo ${courseModule.title}`} className="flex-1" />
              <span className="font-mono text-xs tabular-nums text-fg-muted">
                {progress.done}/{progress.total} misiones
              </span>
            </div>
          )}
        </div>
      </header>

      {state === "locked" && previousModule && (
        <div role="status" className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 text-sm">
          <Lock className="mt-0.5 size-5 shrink-0 text-fg-muted" aria-hidden="true" />
          <p className="text-fg-muted">
            Puedes consultar el temario, pero para empezar necesitas completar el módulo{" "}
            <Link href={`/modulos/${previousModule.id}`} className="font-medium text-primary-ink underline underline-offset-4">
              {previousModule.title}
            </Link>
            .
          </p>
        </div>
      )}

      {state === "coming-soon" && (
        <div role="status" className="mt-6 flex items-start gap-3 rounded-2xl border border-warning-ink/40 bg-surface p-4 text-sm">
          <Hourglass className="mt-0.5 size-5 shrink-0 text-warning-ink" aria-hidden="true" />
          <p className="text-fg-muted">
            <strong className="font-semibold text-fg">Estamos preparando este módulo.</strong> Ya puedes ver qué
            aprenderás; las misiones se activarán en cuanto se publiquen.
          </p>
        </div>
      )}

      <section aria-labelledby="misiones-titulo" className="mt-8">
        <h2 id="misiones-titulo" className="text-lg font-semibold tracking-tight">
          Misiones
        </h2>
        <ol className="mt-4 space-y-3">
          {courseModule.missions.map((mission, missionIndex) => {
            if (!ready) {
              return (
                <li key={mission.id}>
                  <Card as="div" className="flex items-center gap-4">
                    <Skeleton className="size-9 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </Card>
                </li>
              );
            }

            const missionState = getMissionState(curriculum, mission.id, completed);
            const meta = missionStateMeta[missionState];
            const started = view.state.lastStep[mission.id] !== undefined;
            const reason = missionState === "locked" ? getLockReason(curriculum, mission.id, completed) : null;

            return (
              <li key={mission.id}>
                <Card
                  as="article"
                  aria-labelledby={`mision-${mission.id}`}
                  className={cn(
                    "flex flex-col gap-4 sm:flex-row sm:items-center",
                    missionState === "available" && "border-primary/40",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-full font-mono text-sm font-semibold",
                      missionState === "completed" ? "bg-accent-soft text-accent-ink" : "bg-surface-2 text-fg-muted",
                    )}
                    aria-hidden="true"
                  >
                    {missionIndex + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 id={`mision-${mission.id}`} className="font-semibold tracking-tight text-fg">
                        {mission.title}
                      </h3>
                      <Badge tone={meta.tone} icon={meta.icon}>
                        {meta.label}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-fg-muted">{mission.summary}</p>
                    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg-muted">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3.5" aria-hidden="true" />
                        {mission.durationMinutes} min
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Zap className="size-3.5" aria-hidden="true" />
                        {mission.xp} XP
                      </span>
                    </p>
                    {reason && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-fg-muted">
                        <Lock className="size-3.5" aria-hidden="true" />
                        {reason}
                      </p>
                    )}
                  </div>
                  {missionState === "available" && (
                    <ButtonLink href={`/misiones/${mission.id}`} className="sm:shrink-0">
                      {started ? "Continuar" : "Empezar"}
                      <span className="sr-only"> «{mission.title}»</span>
                    </ButtonLink>
                  )}
                  {missionState === "completed" && (
                    <ButtonLink href={`/misiones/${mission.id}`} variant="secondary" className="sm:shrink-0">
                      Repasar
                      <span className="sr-only"> «{mission.title}»</span>
                    </ButtonLink>
                  )}
                </Card>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
