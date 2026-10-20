import { CircleCheck, CircleDashed, Hourglass, Lock, Play } from "lucide-react";
import type { ReactNode } from "react";
import type { BadgeTone } from "@/components/ui/Badge";
import type { MissionState, ModuleState } from "@/lib/progress";

type Meta = { label: string; tone: BadgeTone; icon: ReactNode };
const i = "size-3.5";

export const moduleStateMeta: Record<ModuleState, Meta> = {
  completed: { label: "Completado", tone: "accent", icon: <CircleCheck className={i} aria-hidden="true" /> },
  "in-progress": { label: "En curso", tone: "primary", icon: <Play className={i} aria-hidden="true" /> },
  available: { label: "Disponible", tone: "primary", icon: <CircleDashed className={i} aria-hidden="true" /> },
  locked: { label: "Bloqueado", tone: "neutral", icon: <Lock className={i} aria-hidden="true" /> },
  "coming-soon": { label: "Próximamente", tone: "warning", icon: <Hourglass className={i} aria-hidden="true" /> },
};

export const missionStateMeta: Record<MissionState, Meta> = {
  completed: { label: "Completada", tone: "accent", icon: <CircleCheck className={i} aria-hidden="true" /> },
  available: { label: "Disponible", tone: "primary", icon: <Play className={i} aria-hidden="true" /> },
  locked: { label: "Bloqueada", tone: "neutral", icon: <Lock className={i} aria-hidden="true" /> },
  "coming-soon": { label: "En preparación", tone: "warning", icon: <Hourglass className={i} aria-hidden="true" /> },
};
