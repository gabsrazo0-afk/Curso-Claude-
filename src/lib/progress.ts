/**
 * Lógica de progreso pura (sin React ni navegador) para poder probarla
 * de forma aislada y reutilizarla si el progreso pasa a un servidor.
 */
import type { CourseModule, Mission } from "@/content/types";

export const PROGRESS_VERSION = 1;

export interface MissionRecord {
  completedAt: string;
}

export interface ProgressState {
  version: typeof PROGRESS_VERSION;
  /** Misiones completadas, indexadas por id. */
  completed: Record<string, MissionRecord>;
  /** Último paso visto en cada misión en curso (para retomar). */
  lastStep: Record<string, number>;
  /** Días con actividad, formato AAAA-MM-DD, ordenados y sin repetir. */
  activeDays: string[];
}

export type MissionState = "completed" | "available" | "locked" | "coming-soon";

export type ModuleState =
  | "completed"
  | "in-progress"
  | "available"
  | "locked"
  | "coming-soon";

/** Solo guardamos los días necesarios para calcular la racha. */
const MAX_ACTIVE_DAYS = 120;

export function createEmptyProgress(): ProgressState {
  return { version: PROGRESS_VERSION, completed: {}, lastStep: {}, activeDays: [] };
}

/* ---------- Fechas ---------- */

export function toDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function previousDayKey(dayKey: string): string {
  const [y, m, d] = dayKey.split("-").map(Number);
  return toDayKey(new Date(y, m - 1, d - 1));
}

const DAY_KEY = /^\d{4}-\d{2}-\d{2}$/;

/* ---------- Lectura segura ---------- */

export interface ParseResult {
  state: ProgressState;
  /** true si había datos pero no eran válidos y se descartaron. */
  recovered: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Convierte el texto guardado en un estado válido. Ignora misiones que ya no
 * existen en el temario y descarta por completo datos ilegibles.
 */
export function parseProgress(raw: string | null, validMissionIds: Set<string>): ParseResult {
  if (raw === null) return { state: createEmptyProgress(), recovered: false };

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { state: createEmptyProgress(), recovered: true };
  }

  if (!isRecord(data) || data.version !== PROGRESS_VERSION) {
    return { state: createEmptyProgress(), recovered: true };
  }

  const state = createEmptyProgress();

  if (isRecord(data.completed)) {
    for (const [id, record] of Object.entries(data.completed)) {
      if (
        validMissionIds.has(id) &&
        isRecord(record) &&
        typeof record.completedAt === "string"
      ) {
        state.completed[id] = { completedAt: record.completedAt };
      }
    }
  }

  if (isRecord(data.lastStep)) {
    for (const [id, step] of Object.entries(data.lastStep)) {
      if (validMissionIds.has(id) && Number.isInteger(step) && (step as number) >= 0) {
        state.lastStep[id] = step as number;
      }
    }
  }

  if (Array.isArray(data.activeDays)) {
    state.activeDays = normalizeDays(
      data.activeDays.filter((d): d is string => typeof d === "string" && DAY_KEY.test(d)),
    );
  }

  return { state, recovered: false };
}

function normalizeDays(days: string[]): string[] {
  return Array.from(new Set(days)).sort().slice(-MAX_ACTIVE_DAYS);
}

/* ---------- Cambios de estado (inmutables) ---------- */

export function recordActivity(state: ProgressState, now: Date): ProgressState {
  const today = toDayKey(now);
  if (state.activeDays.includes(today)) return state;
  return { ...state, activeDays: normalizeDays([...state.activeDays, today]) };
}

export function completeMission(
  state: ProgressState,
  missionId: string,
  now: Date,
): ProgressState {
  const withActivity = recordActivity(state, now);
  const lastStep = { ...withActivity.lastStep };
  delete lastStep[missionId];

  if (withActivity.completed[missionId]) {
    return { ...withActivity, lastStep };
  }

  return {
    ...withActivity,
    lastStep,
    completed: {
      ...withActivity.completed,
      [missionId]: { completedAt: now.toISOString() },
    },
  };
}

export function saveLastStep(
  state: ProgressState,
  missionId: string,
  step: number,
): ProgressState {
  if (state.lastStep[missionId] === step) return state;
  return { ...state, lastStep: { ...state.lastStep, [missionId]: step } };
}

/* ---------- Reglas de desbloqueo ---------- */

export function isModuleComplete(courseModule: CourseModule, completed: ProgressState["completed"]) {
  return courseModule.missions.length > 0 && courseModule.missions.every((m) => Boolean(completed[m.id]));
}

export function isModuleUnlocked(
  course: CourseModule[],
  moduleIndex: number,
  completed: ProgressState["completed"],
): boolean {
  if (moduleIndex <= 0) return true;
  return isModuleComplete(course[moduleIndex - 1], completed);
}

export function getModuleState(
  course: CourseModule[],
  moduleId: string,
  completed: ProgressState["completed"],
): ModuleState {
  const index = course.findIndex((m) => m.id === moduleId);
  if (index === -1) return "locked";
  const courseModule = course[index];

  if (!isModuleUnlocked(course, index, completed)) return "locked";
  if (isModuleComplete(courseModule, completed)) return "completed";
  if (!courseModule.missions.some((m) => m.status === "available")) return "coming-soon";
  if (courseModule.missions.some((m) => completed[m.id])) return "in-progress";
  return "available";
}

export function getMissionState(
  course: CourseModule[],
  missionId: string,
  completed: ProgressState["completed"],
): MissionState {
  const moduleIndex = course.findIndex((m) => m.missions.some((x) => x.id === missionId));
  if (moduleIndex === -1) return "locked";

  const courseModule = course[moduleIndex];
  const missionIndex = courseModule.missions.findIndex((m) => m.id === missionId);
  const mission = courseModule.missions[missionIndex];

  if (!isModuleUnlocked(course, moduleIndex, completed)) return "locked";
  if (mission.status === "coming-soon") return "coming-soon";
  if (completed[mission.id]) return "completed";
  if (missionIndex === 0) return "available";
  return completed[courseModule.missions[missionIndex - 1].id] ? "available" : "locked";
}

/** Explica qué falta para desbloquear una misión bloqueada. */
export function getLockReason(
  course: CourseModule[],
  missionId: string,
  completed: ProgressState["completed"],
): string | null {
  const moduleIndex = course.findIndex((m) => m.missions.some((x) => x.id === missionId));
  if (moduleIndex === -1) return null;

  if (!isModuleUnlocked(course, moduleIndex, completed)) {
    return `Completa el módulo «${course[moduleIndex - 1].title}» para desbloquearla.`;
  }

  const missions = course[moduleIndex].missions;
  const index = missions.findIndex((m) => m.id === missionId);
  const previous = missions[index - 1];
  if (previous && !completed[previous.id]) {
    return `Completa «${previous.title}» para desbloquearla.`;
  }
  return null;
}

export interface MissionRef {
  mission: Mission;
  module: CourseModule;
}

/** Primera misión disponible y sin completar, siguiendo el orden del curso. */
export function getNextMission(
  course: CourseModule[],
  completed: ProgressState["completed"],
): MissionRef | null {
  for (const courseModule of course) {
    for (const mission of courseModule.missions) {
      if (getMissionState(course, mission.id, completed) === "available") {
        return { mission, module: courseModule };
      }
    }
  }
  return null;
}

/* ---------- Estadísticas ---------- */

export interface ProgressStats {
  completedCount: number;
  /** Misiones con contenido publicado. */
  availableCount: number;
  totalCount: number;
  /** Porcentaje (0-100) sobre las misiones publicadas. */
  percent: number;
  xp: number;
  streakDays: number;
  modulesCompleted: number;
}

export function computeStreak(activeDays: string[], today: Date): number {
  const days = new Set(activeDays);
  let cursor = toDayKey(today);
  // Si hoy aún no hay actividad, la racha sigue viva desde ayer.
  if (!days.has(cursor)) cursor = previousDayKey(cursor);

  let streak = 0;
  while (days.has(cursor)) {
    streak += 1;
    cursor = previousDayKey(cursor);
  }
  return streak;
}

export function computeStats(
  course: CourseModule[],
  state: ProgressState,
  today: Date,
): ProgressStats {
  const missions = course.flatMap((m) => m.missions);
  const published = missions.filter((m) => m.status === "available");
  const done = missions.filter((m) => state.completed[m.id]);

  return {
    completedCount: done.length,
    availableCount: published.length,
    totalCount: missions.length,
    percent:
      published.length === 0 ? 0 : Math.round((done.length / published.length) * 100),
    xp: done.reduce((sum, m) => sum + m.xp, 0),
    streakDays: computeStreak(state.activeDays, today),
    modulesCompleted: course.filter((m) => isModuleComplete(m, state.completed)).length,
  };
}

export function getModuleProgress(
  courseModule: CourseModule,
  completed: ProgressState["completed"],
): { done: number; total: number; percent: number } {
  const total = courseModule.missions.length;
  const done = courseModule.missions.filter((m) => completed[m.id]).length;
  return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
}
