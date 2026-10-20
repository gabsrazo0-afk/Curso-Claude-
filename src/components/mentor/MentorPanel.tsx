"use client";

import { usePathname } from "next/navigation";
import { ArrowRight, Bot, ChevronRight, Lightbulb } from "lucide-react";
import type { ReactNode } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { ButtonLink } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { curriculum, getMission, getModule } from "@/content/curriculum";
import { mentorFaqs, mentorName } from "@/content/mentor";
import { getModuleState, getNextMission, type ProgressState } from "@/lib/progress";
import { mentor, useMentor, type MentorFocus } from "@/lib/mentor-store";
import { useProgress } from "@/lib/use-progress";
import { renderInline } from "@/components/mission/inline";

interface Hint {
  title: string;
  body: ReactNode;
  action?: { href: string; label: string };
}

function hintFor(pathname: string, focus: MentorFocus | null, state: ProgressState): Hint {
  const missionMatch = pathname.match(/^\/misiones\/([^/]+)/);
  if (missionMatch) {
    const found = getMission(decodeURIComponent(missionMatch[1]));
    if (found && focus && focus.missionId === found.mission.id) {
      if (focus.kind === "step") {
        const step = found.mission.steps[focus.stepIndex];
        if (step) {
          return {
            title: `Pista para «${step.title}»`,
            body: renderInline(step.mentorTip),
          };
        }
      }
      if (focus.kind === "quiz") {
        return {
          title: "Antes de responder",
          body: "Lee todas las opciones con calma. Si te equivocas, verás una explicación y podrás intentarlo de nuevo sin perder nada.",
        };
      }
      if (focus.kind === "done") {
        return {
          title: "¡Misión completada!",
          body: "Buen trabajo. Repasa los objetivos de la misión o continúa con la siguiente cuando quieras.",
        };
      }
    }
    if (found) {
      return {
        title: found.mission.title,
        body: found.mission.summary,
      };
    }
  }

  const moduleMatch = pathname.match(/^\/modulos\/([^/]+)/);
  if (moduleMatch) {
    const courseModule = getModule(decodeURIComponent(moduleMatch[1]));
    if (courseModule) {
      const moduleState = getModuleState(curriculum, courseModule.id, state.completed);
      const bodies: Record<typeof moduleState, string> = {
        locked: "Este módulo aún está bloqueado. Puedes ver su temario, pero primero termina el módulo anterior.",
        "coming-soon": "Estamos preparando las misiones de este módulo. Mientras tanto, repasa lo que ya has aprendido.",
        completed: "Ya completaste este módulo. Puedes repasar cualquier misión cuando quieras.",
        "in-progress": "Vas por buen camino. Continúa con la siguiente misión desbloqueada.",
        available: "Empieza por la primera misión: cada una desbloquea la siguiente.",
      };
      return { title: courseModule.title, body: bodies[moduleState] };
    }
  }

  const next = getNextMission(curriculum, state.completed);
  if (next) {
    const started = state.lastStep[next.mission.id] !== undefined;
    return {
      title: started ? "Retoma donde lo dejaste" : "Tu siguiente paso",
      body: (
        <>
          Te recomiendo la misión <strong className="text-fg">«{next.mission.title}»</strong>.
          Dura unos {next.mission.durationMinutes} minutos y su primer objetivo es:{" "}
          {next.mission.objectives[0]?.toLowerCase()}
        </>
      ),
      action: {
        href: `/misiones/${next.mission.id}`,
        label: started ? "Continuar misión" : "Empezar misión",
      },
    };
  }

  return {
    title: "¡Has completado todo lo disponible!",
    body: "Has terminado todas las misiones publicadas. Pronto llegarán nuevos módulos; mientras tanto, practica en un proyecto propio.",
  };
}

export function MentorPanel() {
  const { open, focus } = useMentor();
  const pathname = usePathname();
  const { view } = useProgress();

  const hint = view.status === "ready" ? hintFor(pathname, focus, view.state) : null;

  return (
    <Dialog
      open={open}
      onClose={mentor.close}
      placement="side"
      title={
        <span className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary-ink">
            <Bot className="size-4" aria-hidden="true" />
          </span>
          {mentorName}, tu mentora
        </span>
      }
      description="Ayuda adaptada a lo que estás haciendo ahora."
    >
      <section aria-labelledby="mentor-now" className="rounded-2xl border border-primary/30 bg-primary-soft p-4">
        <h3 id="mentor-now" className="flex items-center gap-2 text-sm font-semibold text-primary-ink">
          <Lightbulb className="size-4" aria-hidden="true" />
          {hint ? hint.title : "Cargando tu contexto…"}
        </h3>
        {hint ? (
          <>
            <p className="mt-2 text-sm leading-relaxed text-fg">{hint.body}</p>
            {hint.action && (
              <ButtonLink
                href={hint.action.href}
                onClick={mentor.close}
                size="sm"
                className="mt-4"
                iconAfter={<ArrowRight className="size-4" aria-hidden="true" />}
              >
                {hint.action.label}
              </ButtonLink>
            )}
          </>
        ) : (
          <div className="mt-3 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        )}
      </section>

      <section aria-labelledby="mentor-faq" className="mt-6">
        <h3 id="mentor-faq" className="text-sm font-semibold text-fg">
          Preguntas frecuentes
        </h3>
        <ul className="mt-3 divide-y divide-border rounded-2xl border border-border">
          {mentorFaqs.map((faq) => (
            <li key={faq.id}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-fg hover:text-primary-ink [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronRight
                    className="size-4 shrink-0 text-fg-muted transition-transform group-open:rotate-90"
                    aria-hidden="true"
                  />
                </summary>
                <p className="px-4 pb-4 text-sm leading-relaxed text-fg-muted">{faq.answer}</p>
              </details>
            </li>
          ))}
        </ul>
      </section>
    </Dialog>
  );
}
