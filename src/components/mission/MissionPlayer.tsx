"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Lightbulb, Target, Zap } from "lucide-react";
import Link from "next/link";
import type { CourseModule, Mission } from "@/content/types";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, Eyebrow } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { curriculum } from "@/content/curriculum";
import { getNextMission } from "@/lib/progress";
import { mentor } from "@/lib/mentor-store";
import { useProgress } from "@/lib/use-progress";
import { cn } from "@/lib/cn";
import { Celebration } from "./Celebration";
import { CodeBlock } from "./CodeBlock";
import { Quiz } from "./Quiz";
import { renderInline } from "./inline";

interface MissionPlayerProps {
  mission: Mission;
  module: CourseModule;
  initialStep: number;
  /** Si la misión ya estaba completada al abrirla (modo repaso). */
  alreadyCompleted: boolean;
}

export function MissionPlayer({ mission, module, initialStep, alreadyCompleted }: MissionPlayerProps) {
  const { view, complete, rememberStep } = useProgress();
  // Se fija al montar: al completar, el progreso cambia pero esta visita fue la primera.
  const [wasCompleted] = useState(alreadyCompleted);
  const quizIndex = mission.steps.length;
  const totalPhases = mission.steps.length + 1;

  const [phase, setPhase] = useState(() => Math.min(Math.max(initialStep, 0), quizIndex));
  const [done, setDone] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Solo movemos el foco tras una acción del alumno, nunca al cargar la página.
  const [hasNavigated, setHasNavigated] = useState(false);

  // Informa al mentor de en qué punto está el alumno.
  useEffect(() => {
    if (done) mentor.setFocus({ kind: "done", missionId: mission.id });
    else if (phase < quizIndex) mentor.setFocus({ kind: "step", missionId: mission.id, stepIndex: phase });
    else mentor.setFocus({ kind: "quiz", missionId: mission.id });
  }, [done, phase, quizIndex, mission.id]);

  useEffect(() => () => mentor.setFocus(null), []);

  function goTo(next: number) {
    setHasNavigated(true);
    setPhase(next);
    if (!wasCompleted) rememberStep(mission.id, next);
  }

  function finish() {
    setHasNavigated(true);
    complete(mission.id);
    setDone(true);
  }

  const percent = done ? 100 : (phase / totalPhases) * 100;
  const step = phase < quizIndex ? mission.steps[phase] : null;

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
      <div className="min-w-0">
        <Link
          href={`/modulos/${module.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-fg-muted transition-colors hover:text-primary-ink"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {module.title}
        </Link>

        <div className="mt-5">
          <Eyebrow>Misión · {mission.durationMinutes} min · {mission.xp} XP</Eyebrow>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">{mission.title}</h1>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs text-fg-muted">
            <span>
              {done ? "Misión completada" : phase < quizIndex ? `Paso ${phase + 1} de ${totalPhases}` : `Comprobación final · ${totalPhases} de ${totalPhases}`}
            </span>
            <span className="font-mono tabular-nums">{Math.round(percent)}%</span>
          </div>
          <ProgressBar value={percent} label={`Avance en la misión ${mission.title}`} size="sm" />
          <ol className="mt-3 flex gap-1.5" aria-label="Pasos de la misión">
            {Array.from({ length: totalPhases }, (_, i) => {
              const isCurrent = !done && i === phase;
              const isDone = done || i < phase;
              return (
                <li
                  key={i}
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "h-1 flex-1 rounded-full",
                    isDone ? "bg-accent" : isCurrent ? "bg-primary" : "bg-surface-2",
                  )}
                >
                  <span className="sr-only">
                    {i < quizIndex ? mission.steps[i].title : "Comprobación final"}
                    {isDone ? " (completado)" : isCurrent ? " (actual)" : ""}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <Card className="mt-6" aria-live="off">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={done ? "done" : phase}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              // El contenido nuevo se monta tras la animación de salida: movemos
              // el foco a su encabezado para que los lectores de pantalla lo anuncien.
              onAnimationStart={() => {
                if (hasNavigated) headingRef.current?.focus();
              }}
            >
              {done ? (
                <DoneView
                  headingRef={headingRef}
                  mission={mission}
                  firstTime={!wasCompleted}
                  totalXp={view.status === "ready" ? view.stats.xp : null}
                  next={view.status === "ready" ? getNextMission(curriculum, view.state.completed) : null}
                />
              ) : step ? (
                <div>
                  <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold tracking-tight text-fg focus:outline-none">
                    {step.title}
                  </h2>
                  <div className="mt-4 space-y-4 leading-relaxed text-fg-muted">
                    {step.body.map((paragraph, i) => (
                      <p key={i}>{renderInline(paragraph)}</p>
                    ))}
                  </div>
                  {step.code && (
                    <div className="mt-5">
                      <CodeBlock snippet={step.code} />
                    </div>
                  )}
                  <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                    <Button
                      variant="ghost"
                      onClick={() => goTo(phase - 1)}
                      disabled={phase === 0}
                      icon={<ArrowLeft className="size-4" aria-hidden="true" />}
                    >
                      Anterior
                    </Button>
                    <Button onClick={() => goTo(phase + 1)} iconAfter={<ArrowRight className="size-4" aria-hidden="true" />}>
                      {phase + 1 === quizIndex ? "Ir a la comprobación" : "Siguiente"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold tracking-tight text-fg focus:outline-none">
                    Comprueba lo que has aprendido
                  </h2>
                  <p className="mt-2 text-sm text-fg-muted">
                    Acierta todas las preguntas para completar la misión. Puedes intentarlo las veces que quieras.
                  </p>
                  <div className="mt-6">
                    {mission.quiz.length > 0 ? (
                      <Quiz
                        questions={mission.quiz}
                        onPassed={finish}
                        submitLabel={wasCompleted ? "Comprobar" : "Comprobar y completar"}
                      />
                    ) : (
                      <Button size="lg" onClick={finish}>
                        Completar misión
                      </Button>
                    )}
                  </div>
                  {mission.steps.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-6"
                      onClick={() => goTo(quizIndex - 1)}
                      icon={<ArrowLeft className="size-4" aria-hidden="true" />}
                    >
                      Volver al último paso
                    </Button>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>

      <aside className="space-y-4 lg:pt-28" aria-label="Información de la misión">
        <Card className="p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-fg">
            <Target className="size-4 text-primary-ink" aria-hidden="true" />
            Objetivos
          </h2>
          <ul className="mt-3 space-y-2">
            {mission.objectives.map((objective) => (
              <li key={objective} className="flex items-start gap-2 text-sm text-fg-muted">
                <Check className="mt-0.5 size-4 shrink-0 text-accent-ink" aria-hidden="true" />
                {objective}
              </li>
            ))}
          </ul>
        </Card>
        {!done && (
          <Button
            variant="secondary"
            className="w-full"
            onClick={mentor.open}
            aria-haspopup="dialog"
            icon={<Lightbulb className="size-4" aria-hidden="true" />}
          >
            Ver pista de este paso
          </Button>
        )}
      </aside>
    </div>
  );
}

function DoneView({
  headingRef,
  mission,
  firstTime,
  totalXp,
  next,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>;
  mission: Mission;
  firstTime: boolean;
  totalXp: number | null;
  next: ReturnType<typeof getNextMission>;
}) {
  return (
    <div className="py-4 text-center">
      <Celebration />
      <h2 ref={headingRef} tabIndex={-1} className="mt-6 text-2xl font-semibold tracking-tight text-fg focus:outline-none">
        {firstTime ? "¡Misión completada!" : "¡Repaso completado!"}
      </h2>
      <p className="mt-2 text-fg-muted">
        {firstTime ? (
          <>
            Has terminado «{mission.title}».{" "}
            <span className="inline-flex items-center gap-1 font-semibold text-accent-ink">
              <Zap className="size-4" aria-hidden="true" />+{mission.xp} XP
            </span>
          </>
        ) : (
          <>Ya habías completado esta misión, así que no suma experiencia de nuevo.</>
        )}
      </p>
      {totalXp !== null && <p className="mt-1 text-sm text-fg-muted">Total acumulado: {totalXp} XP</p>}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {next && (
          <ButtonLink
            href={`/misiones/${next.mission.id}`}
            size="lg"
            iconAfter={<ArrowRight className="size-4" aria-hidden="true" />}
          >
            Siguiente: {next.mission.title}
          </ButtonLink>
        )}
        <ButtonLink href="/" size="lg" variant={next ? "secondary" : "primary"}>
          Volver al panel
        </ButtonLink>
      </div>
    </div>
  );
}
