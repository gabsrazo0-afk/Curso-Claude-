"use client";

import { useState } from "react";
import { BookOpen, Flame, Layers, RotateCcw, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Skeleton } from "@/components/ui/Skeleton";
import { curriculum } from "@/content/curriculum";
import type { ProgressView } from "@/lib/use-progress";

function Stat({ icon, label, value, hint }: { icon: ReactNode; label: string; value: string; hint?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface-2 px-3 py-2.5">
      <span className="text-primary-ink" aria-hidden="true">
        {icon}
      </span>
      <dt className="flex-1 text-sm text-fg-muted">
        {label}
        {hint && <span className="sr-only"> ({hint})</span>}
      </dt>
      <dd className="font-mono text-sm font-semibold tabular-nums text-fg">{value}</dd>
    </div>
  );
}

export function ProgressStats({ view, onReset }: { view: ProgressView; onReset: () => void }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (view.status === "loading") {
    return (
      <Card aria-label="Cargando progreso" aria-busy="true">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mx-auto mt-6 size-32 rounded-full" />
        <div className="mt-6 space-y-2">
          {[0, 1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-10 w-full rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  const { stats } = view;
  const hasProgress = stats.completedCount > 0 || Object.keys(view.state.lastStep).length > 0;

  return (
    <Card aria-labelledby="progreso-titulo">
      <CardTitle id="progreso-titulo">Tu progreso</CardTitle>
      <div className="mt-5 flex justify-center">
        <ProgressRing value={stats.percent} label="Progreso del curso publicado" />
      </div>
      <p className="mt-3 text-center text-sm text-fg-muted">
        {stats.completedCount} de {stats.availableCount} misiones disponibles
      </p>

      <dl className="mt-5 space-y-2">
        <Stat icon={<Zap className="size-4" />} label="Experiencia" value={`${stats.xp} XP`} />
        <Stat
          icon={<Flame className="size-4" />}
          label="Racha"
          value={`${stats.streakDays} ${stats.streakDays === 1 ? "día" : "días"}`}
          hint="días seguidos con actividad"
        />
        <Stat
          icon={<BookOpen className="size-4" />}
          label="Temario completo"
          value={`${stats.completedCount}/${stats.totalCount}`}
          hint="misiones completadas, incluidas las que están en preparación"
        />
        <Stat
          icon={<Layers className="size-4" />}
          label="Módulos"
          value={`${stats.modulesCompleted}/${curriculum.length}`}
        />
      </dl>

      {hasProgress && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="mt-4 w-full"
            onClick={() => setConfirmOpen(true)}
            aria-haspopup="dialog"
            icon={<RotateCcw className="size-4" aria-hidden="true" />}
          >
            Reiniciar progreso
          </Button>
          <Dialog
            open={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            title="¿Reiniciar tu progreso?"
            description="Se borrarán tus misiones completadas, tu experiencia y tu racha en este navegador."
          >
            <div className="flex flex-wrap justify-end gap-3">
              <Button variant="secondary" onClick={() => setConfirmOpen(false)} autoFocus>
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  onReset();
                  setConfirmOpen(false);
                }}
              >
                Sí, reiniciar
              </Button>
            </div>
          </Dialog>
        </>
      )}
    </Card>
  );
}
