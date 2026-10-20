import { describe, expect, it } from "vitest";
import { allMissions, curriculum } from "@/content/curriculum";
import type { CourseModule } from "@/content/types";
import {
  completeMission,
  computeStats,
  computeStreak,
  createEmptyProgress,
  getLockReason,
  getMissionState,
  getModuleState,
  getNextMission,
  parseProgress,
  saveLastStep,
} from "./progress";

const ids = new Set(allMissions.map((m) => m.id));
const day = (iso: string) => new Date(`${iso}T12:00:00`);

describe("contenido del curso", () => {
  it("tiene ids de misión únicos", () => {
    expect(ids.size).toBe(allMissions.length);
  });

  it("cada misión publicada tiene pasos, objetivos y respuestas válidas", () => {
    for (const mission of allMissions.filter((m) => m.status === "available")) {
      expect(mission.steps.length).toBeGreaterThan(0);
      expect(mission.objectives.length).toBeGreaterThan(0);
      for (const q of mission.quiz) {
        expect(q.options.map((o) => o.id)).toContain(q.correctOptionId);
      }
    }
  });
});

describe("parseProgress", () => {
  it("devuelve un estado vacío si no hay datos", () => {
    expect(parseProgress(null, ids)).toEqual({ state: createEmptyProgress(), recovered: false });
  });

  it("recupera datos ilegibles sin romper", () => {
    expect(parseProgress("{no es json", ids).recovered).toBe(true);
    expect(parseProgress(JSON.stringify({ version: 99 }), ids).recovered).toBe(true);
  });

  it("descarta misiones desconocidas y valores inválidos", () => {
    const raw = JSON.stringify({
      version: 1,
      completed: {
        "conoce-claude-code": { completedAt: "2026-10-01T10:00:00.000Z" },
        "mision-inexistente": { completedAt: "2026-10-01T10:00:00.000Z" },
      },
      lastStep: { "instala-claude-code": 2, "conoce-claude-code": -1 },
      activeDays: ["2026-10-02", "2026-10-01", "2026-10-01", "fecha-mala"],
    });
    const { state, recovered } = parseProgress(raw, ids);
    expect(recovered).toBe(false);
    expect(Object.keys(state.completed)).toEqual(["conoce-claude-code"]);
    expect(state.lastStep).toEqual({ "instala-claude-code": 2 });
    expect(state.activeDays).toEqual(["2026-10-01", "2026-10-02"]);
  });
});

describe("desbloqueo de misiones", () => {
  const empty = createEmptyProgress().completed;

  it("solo la primera misión está disponible al empezar", () => {
    expect(getMissionState(curriculum, "conoce-claude-code", empty)).toBe("available");
    expect(getMissionState(curriculum, "instala-claude-code", empty)).toBe("locked");
    expect(getModuleState(curriculum, "trabajar-con-codigo", empty)).toBe("locked");
  });

  it("completar una misión desbloquea la siguiente", () => {
    const state = completeMission(createEmptyProgress(), "conoce-claude-code", day("2026-10-20"));
    expect(getMissionState(curriculum, "conoce-claude-code", state.completed)).toBe("completed");
    expect(getMissionState(curriculum, "instala-claude-code", state.completed)).toBe("available");
    expect(getModuleState(curriculum, "primeros-pasos", state.completed)).toBe("in-progress");
    expect(getNextMission(curriculum, state.completed)?.mission.id).toBe("instala-claude-code");
  });

  it("explica por qué una misión está bloqueada", () => {
    expect(getLockReason(curriculum, "instala-claude-code", empty)).toContain("Conoce a Claude Code");
    expect(getLockReason(curriculum, "leer-un-proyecto", empty)).toContain("Primeros pasos");
  });

  it("al terminar el primer módulo, el siguiente se abre como 'próximamente'", () => {
    let state = createEmptyProgress();
    for (const m of curriculum[0].missions) state = completeMission(state, m.id, day("2026-10-20"));
    expect(getModuleState(curriculum, "primeros-pasos", state.completed)).toBe("completed");
    expect(getModuleState(curriculum, "trabajar-con-codigo", state.completed)).toBe("coming-soon");
    expect(getMissionState(curriculum, "leer-un-proyecto", state.completed)).toBe("coming-soon");
    expect(getNextMission(curriculum, state.completed)).toBeNull();
  });

  it("funciona con un temario arbitrario", () => {
    const course: CourseModule[] = [
      { ...curriculum[0], id: "a", missions: [{ ...curriculum[0].missions[0], id: "a1" }] },
      { ...curriculum[0], id: "b", missions: [{ ...curriculum[0].missions[1], id: "b1" }] },
    ];
    expect(getMissionState(course, "b1", {})).toBe("locked");
    expect(getMissionState(course, "b1", { a1: { completedAt: "x" } })).toBe("available");
  });
});

describe("completeMission", () => {
  it("no duplica una misión ya completada y limpia el paso guardado", () => {
    let state = saveLastStep(createEmptyProgress(), "conoce-claude-code", 2);
    state = completeMission(state, "conoce-claude-code", day("2026-10-20"));
    const firstDate = state.completed["conoce-claude-code"].completedAt;
    state = completeMission(state, "conoce-claude-code", day("2026-10-21"));
    expect(state.completed["conoce-claude-code"].completedAt).toBe(firstDate);
    expect(state.lastStep).toEqual({});
    expect(state.activeDays).toEqual(["2026-10-20", "2026-10-21"]);
  });
});

describe("estadísticas", () => {
  it("calcula XP y porcentaje sobre las misiones publicadas", () => {
    const state = completeMission(createEmptyProgress(), "conoce-claude-code", day("2026-10-20"));
    const stats = computeStats(curriculum, state, day("2026-10-20"));
    const published = allMissions.filter((m) => m.status === "available").length;
    expect(stats.completedCount).toBe(1);
    expect(stats.availableCount).toBe(published);
    expect(stats.percent).toBe(Math.round((1 / published) * 100));
    expect(stats.xp).toBe(50);
    expect(stats.streakDays).toBe(1);
  });

  it("la racha cuenta días seguidos y sigue viva hasta el final del día siguiente", () => {
    const days = ["2026-10-17", "2026-10-18", "2026-10-19"];
    expect(computeStreak(days, day("2026-10-19"))).toBe(3);
    expect(computeStreak(days, day("2026-10-20"))).toBe(3);
    expect(computeStreak(days, day("2026-10-21"))).toBe(0);
    expect(computeStreak(["2026-10-15", "2026-10-19"], day("2026-10-19"))).toBe(1);
  });

  it("la racha atraviesa cambios de mes", () => {
    expect(computeStreak(["2026-09-30", "2026-10-01"], day("2026-10-01"))).toBe(2);
  });
});
