"use client";

import { useSyncExternalStore } from "react";

/** Dónde está el alumno dentro de una misión, para dar pistas contextuales. */
export type MentorFocus =
  | { kind: "step"; missionId: string; stepIndex: number }
  | { kind: "quiz"; missionId: string }
  | { kind: "done"; missionId: string };

interface MentorSnapshot {
  open: boolean;
  focus: MentorFocus | null;
}

const serverSnapshot: MentorSnapshot = { open: false, focus: null };
let snapshot: MentorSnapshot = serverSnapshot;
const listeners = new Set<() => void>();

function set(next: Partial<MentorSnapshot>) {
  snapshot = { ...snapshot, ...next };
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const mentor = {
  open: () => set({ open: true }),
  close: () => set({ open: false }),
  setFocus: (focus: MentorFocus | null) => set({ focus }),
};

export function useMentor(): MentorSnapshot {
  return useSyncExternalStore(subscribe, () => snapshot, () => serverSnapshot);
}
