import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { CardTitle } from "@/components/ui/Card";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { curriculum } from "@/content/curriculum";
import { getModuleProgress, getModuleState } from "@/lib/progress";
import { cn } from "@/lib/cn";
import type { ProgressView } from "@/lib/use-progress";
import { moduleStateMeta } from "./statusMeta";

export function ModulePath({ view }: { view: ProgressView }) {
  return (
    <section aria-labelledby="ruta-titulo" id="ruta" className="scroll-mt-24">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <CardTitle id="ruta-titulo" className="text-lg">
            Ruta de aprendizaje
          </CardTitle>
          <p className="mt-1 text-sm text-fg-muted">
            {curriculum.length} módulos. Termina uno para desbloquear el siguiente.
          </p>
        </div>
      </div>

      <ol className="relative space-y-3">
        {/* Línea que conecta los módulos */}
        <span aria-hidden="true" className="absolute top-6 bottom-6 left-[1.6rem] w-px bg-border sm:left-[1.85rem]" />
        {curriculum.map((module, index) => {
          if (view.status === "loading") {
            return (
              <li key={module.id} className="relative flex items-center gap-4 rounded-2xl border border-border bg-surface p-4">
                <Skeleton className="size-11 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </li>
            );
          }

          const state = getModuleState(curriculum, module.id, view.state.completed);
          const progress = getModuleProgress(module, view.state.completed);
          const meta = moduleStateMeta[state];
          const muted = state === "locked";

          return (
            <li key={module.id} className="relative">
              <Link
                href={`/modulos/${module.id}`}
                className={cn(
                  "group flex items-center gap-4 rounded-2xl border bg-surface p-4 transition-[border-color,transform,box-shadow] duration-200 sm:p-5",
                  "hover:border-primary/60 hover:shadow-card motion-safe:hover:-translate-y-0.5",
                  state === "in-progress" || state === "available" ? "border-primary/35" : "border-border",
                )}
              >
                <span
                  className={cn(
                    "relative z-10 grid size-11 shrink-0 place-items-center rounded-xl border",
                    state === "completed" && "border-accent/40 bg-accent-soft text-accent-ink",
                    (state === "in-progress" || state === "available") && "border-primary/40 bg-primary-soft text-primary-ink",
                    (state === "locked" || state === "coming-soon") && "border-border bg-surface-2 text-fg-muted",
                  )}
                >
                  <ModuleIcon name={module.icon} className="size-5" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-mono text-xs text-fg-muted">Módulo {index + 1}</span>
                    <Badge tone={meta.tone} icon={meta.icon}>
                      {meta.label}
                    </Badge>
                  </span>
                  <span className={cn("mt-1 block font-semibold tracking-tight", muted ? "text-fg-muted" : "text-fg")}>
                    {module.title}
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-sm text-fg-muted">{module.description}</span>
                  <span className="mt-3 flex items-center gap-3">
                    <ProgressBar
                      value={progress.percent}
                      label={`Progreso del módulo ${module.title}`}
                      size="sm"
                      className="max-w-56 flex-1"
                    />
                    <span className="font-mono text-xs tabular-nums text-fg-muted">
                      {progress.done}/{progress.total}
                    </span>
                  </span>
                </span>

                <ChevronRight
                  className="size-5 shrink-0 text-fg-muted transition-transform group-hover:text-primary-ink motion-safe:group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
